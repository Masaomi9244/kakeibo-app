package annualsummary

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/annualsummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

const yearLayout = "2006"

// GetAnnualSummaryUsecase は対象年の年間サマリーを取得する。
type GetAnnualSummaryUsecase struct {
	monthlySummaryRepository monthlysummary.Repository
	location                 *time.Location
}

// NewGetAnnualSummaryUsecase は年間サマリー取得usecaseを作成する。
func NewGetAnnualSummaryUsecase(
	monthlySummaryRepository monthlysummary.Repository,
	location *time.Location,
) *GetAnnualSummaryUsecase {
	return &GetAnnualSummaryUsecase{
		monthlySummaryRepository: monthlySummaryRepository,
		location:                 location,
	}
}

// Execute はYYYY形式の年を検証し、対象ユーザーの年間サマリーを返す。
func (u *GetAnnualSummaryUsecase) Execute(ctx context.Context, userID, yearValue string) (annualsummary.AnnualSummary, error) {
	year, err := u.parseYear(yearValue)
	if err != nil {
		return annualsummary.AnnualSummary{}, err
	}

	summary := annualsummary.AnnualSummary{
		Year:   year,
		Months: make([]annualsummary.MonthSummary, 0, 12),
	}

	for month := time.January; month <= time.December; month++ {
		monthStart := time.Date(year, month, 1, 0, 0, 0, 0, u.location)
		monthEnd := monthStart.AddDate(0, 1, 0)

		monthlySummary, err := u.monthlySummaryRepository.Get(
			ctx,
			userID,
			monthStart.Format("2006-01"),
			monthStart,
			monthEnd,
		)
		if err != nil {
			return annualsummary.AnnualSummary{}, fmt.Errorf("get monthly summary for annual summary: %w", err)
		}

		summary.Months = append(summary.Months, toMonthSummary(monthlySummary))
		summary.TotalIncome += monthlySummary.TotalIncome
		summary.AvailableIncome += monthlySummary.AvailableIncome
		summary.ReservedIncome += monthlySummary.ReservedIncome
		summary.FixedCostTotal += monthlySummary.FixedCostTotal
		summary.ExpenseTotal += monthlySummary.ExpenseTotal
	}

	summary.ActualBalance = summary.TotalIncome - summary.FixedCostTotal - summary.ExpenseTotal
	summary.AvailableBalance = summary.AvailableIncome - summary.FixedCostTotal - summary.ExpenseTotal

	return summary, nil
}

// parseYear はYYYY形式の入力値を対象年へ変換する。
func (u *GetAnnualSummaryUsecase) parseYear(value string) (int, error) {
	yearStart, err := time.ParseInLocation(yearLayout, value, u.location)
	if err != nil {
		return 0, fmt.Errorf("%w: invalid year", apperror.ErrValidation)
	}

	return yearStart.Year(), nil
}

// toMonthSummary は月次サマリーdomain modelを年間サマリー用の月別modelへ変換する。
func toMonthSummary(summary monthlysummary.MonthlySummary) annualsummary.MonthSummary {
	return annualsummary.MonthSummary{
		Month:            summary.Month,
		TotalIncome:      summary.TotalIncome,
		AvailableIncome:  summary.AvailableIncome,
		ReservedIncome:   summary.ReservedIncome,
		FixedCostTotal:   summary.FixedCostTotal,
		ExpenseTotal:     summary.ExpenseTotal,
		ActualBalance:    summary.ActualBalance,
		AvailableBalance: summary.RemainingAmount,
	}
}
