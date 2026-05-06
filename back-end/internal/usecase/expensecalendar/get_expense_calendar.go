package expensecalendar

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expensecalendar"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

const dateLayout = "2006-01-02"

// GetExpenseCalendarInput はカレンダー取得条件を表す。
type GetExpenseCalendarInput struct {
	Month string
	Date  string
}

// GetExpenseCalendarUsecase は対象月のカレンダー集計を取得する。
type GetExpenseCalendarUsecase struct {
	calendarRepository expensecalendar.Repository
	expenseRepository  expense.Repository
	summaryRepository  monthlysummary.Repository
	location           *time.Location
}

// NewGetExpenseCalendarUsecase はカレンダー取得usecaseを作成する。
func NewGetExpenseCalendarUsecase(
	calendarRepository expensecalendar.Repository,
	expenseRepository expense.Repository,
	summaryRepository monthlysummary.Repository,
	location *time.Location,
) *GetExpenseCalendarUsecase {
	return &GetExpenseCalendarUsecase{
		calendarRepository: calendarRepository,
		expenseRepository:  expenseRepository,
		summaryRepository:  summaryRepository,
		location:           location,
	}
}

// Execute は対象月の日別出費合計、日別残額、月次集計、選択日明細を返す。
func (u *GetExpenseCalendarUsecase) Execute(
	ctx context.Context,
	userID string,
	input GetExpenseCalendarInput,
) (expensecalendar.ExpenseCalendar, error) {
	monthPeriod, err := dateperiod.ParseMonth(input.Month, u.location)
	if err != nil {
		return expensecalendar.ExpenseCalendar{}, err
	}

	selectedDate, err := u.parseSelectedDate(input.Date, monthPeriod)
	if err != nil {
		return expensecalendar.ExpenseCalendar{}, err
	}

	summary, err := u.summaryRepository.Get(ctx, userID, monthPeriod.Value, monthPeriod.Start, monthPeriod.End)
	if err != nil {
		return expensecalendar.ExpenseCalendar{}, fmt.Errorf("get monthly summary for expense calendar: %w", err)
	}

	dailyTotals, err := u.calendarRepository.ListDailyExpenseTotals(ctx, userID, monthPeriod.Start, monthPeriod.End)
	if err != nil {
		return expensecalendar.ExpenseCalendar{}, fmt.Errorf("list daily expense totals: %w", err)
	}

	selectedExpenses, err := u.listSelectedDateExpenses(ctx, userID, selectedDate)
	if err != nil {
		return expensecalendar.ExpenseCalendar{}, err
	}

	return expensecalendar.ExpenseCalendar{
		Month:                summary.Month,
		AvailableIncome:      summary.AvailableIncome,
		FixedCostTotal:       summary.FixedCostTotal,
		ExpenseTotal:         summary.ExpenseTotal,
		RemainingAmount:      summary.RemainingAmount,
		Days:                 buildDays(monthPeriod, summary, dailyTotals, u.location),
		SelectedDateExpenses: selectedExpenses,
	}, nil
}

// parseSelectedDate は任意の選択日を検証し、対象月内の日付期間へ変換する。
func (u *GetExpenseCalendarUsecase) parseSelectedDate(
	value string,
	monthPeriod dateperiod.MonthPeriod,
) (dateperiod.DatePeriod, error) {
	if value == "" {
		return dateperiod.DatePeriod{}, nil
	}

	date, err := dateperiod.ParseDate(value, u.location)
	if err != nil {
		return dateperiod.DatePeriod{}, err
	}

	if date.Start.Before(monthPeriod.Start) || !date.Start.Before(monthPeriod.End) {
		return dateperiod.DatePeriod{}, fmt.Errorf("%w: date must be in month", apperror.ErrValidation)
	}

	return date, nil
}

// listSelectedDateExpenses は選択日が指定された場合のみ、その日の出費一覧を取得する。
func (u *GetExpenseCalendarUsecase) listSelectedDateExpenses(
	ctx context.Context,
	userID string,
	selectedDate dateperiod.DatePeriod,
) ([]expense.Expense, error) {
	if selectedDate.Value == "" {
		return []expense.Expense{}, nil
	}

	expenses, err := u.expenseRepository.ListByDate(ctx, userID, selectedDate.Start, selectedDate.End)
	if err != nil {
		return nil, fmt.Errorf("list selected date expenses: %w", err)
	}

	return expenses, nil
}

// buildDays は月内各日の出費合計と日次残額を生成する。
func buildDays(
	monthPeriod dateperiod.MonthPeriod,
	summary monthlysummary.MonthlySummary,
	dailyTotals []expensecalendar.DailyExpenseTotal,
	location *time.Location,
) []expensecalendar.Day {
	dailyTotalByDate := make(map[string]int, len(dailyTotals))
	for _, dailyTotal := range dailyTotals {
		dailyTotalByDate[dailyTotal.Date.In(location).Format(dateLayout)] = dailyTotal.ExpenseTotal
	}

	days := make([]expensecalendar.Day, 0, monthPeriod.End.AddDate(0, 0, -1).Day())
	cumulativeExpenseTotal := 0
	for current := monthPeriod.Start; current.Before(monthPeriod.End); current = current.AddDate(0, 0, 1) {
		date := current.Format(dateLayout)
		expenseTotal := dailyTotalByDate[date]
		cumulativeExpenseTotal += expenseTotal

		days = append(days, expensecalendar.Day{
			Date:            date,
			ExpenseTotal:    expenseTotal,
			RemainingAmount: summary.AvailableIncome - summary.FixedCostTotal - cumulativeExpenseTotal,
		})
	}

	return days
}
