package expensecalendar

import (
	"context"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
)

// ExpenseCalendar は対象月のカレンダー表示に必要な集計結果を表す。
type ExpenseCalendar struct {
	Month                string
	Days                 []Day
	SelectedDateExpenses []expense.Expense
	AvailableIncome      int
	FixedCostTotal       int
	ExpenseTotal         int
	RemainingAmount      int
}

// Day は対象日の出費合計とその日終了時点の残額を表す。
type Day struct {
	Date            string
	ExpenseTotal    int
	RemainingAmount int
}

// DailyExpenseTotal はDBから取得した日別出費合計を表す。
type DailyExpenseTotal struct {
	Date         time.Time
	ExpenseTotal int
}

// Repository はカレンダー用の日別集計を行う。
type Repository interface {
	ListDailyExpenseTotals(ctx context.Context, userID string, start, end time.Time) ([]DailyExpenseTotal, error)
}
