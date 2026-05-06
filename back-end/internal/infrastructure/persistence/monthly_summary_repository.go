package persistence

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
)

// MonthlySummaryRepository は月次サマリーの集計queryを実行する。
type MonthlySummaryRepository struct {
	db *gorm.DB
}

// NewMonthlySummaryRepository は月次サマリーrepositoryを作成する。
func NewMonthlySummaryRepository(db *gorm.DB) *MonthlySummaryRepository {
	return &MonthlySummaryRepository{db: db}
}

// Get は対象月の収入、固定費、出費を集計し、残額を計算する。
func (r *MonthlySummaryRepository) Get(
	ctx context.Context,
	userID string,
	month string,
	start time.Time,
	end time.Time,
) (monthlysummary.MonthlySummary, error) {
	totalIncome, err := r.sumIncome(ctx, userID, start, end, nil)
	if err != nil {
		return monthlysummary.MonthlySummary{}, err
	}

	included := true
	availableIncome, err := r.sumIncome(ctx, userID, start, end, &included)
	if err != nil {
		return monthlysummary.MonthlySummary{}, err
	}

	excluded := false
	reservedIncome, err := r.sumIncome(ctx, userID, start, end, &excluded)
	if err != nil {
		return monthlysummary.MonthlySummary{}, err
	}

	fixedCostTotal, err := r.sumFixedCost(ctx, userID, start)
	if err != nil {
		return monthlysummary.MonthlySummary{}, err
	}

	expenseTotal, err := r.sumExpense(ctx, userID, start, end)
	if err != nil {
		return monthlysummary.MonthlySummary{}, err
	}

	return monthlysummary.MonthlySummary{
		Month:           month,
		TotalIncome:     totalIncome,
		AvailableIncome: availableIncome,
		ReservedIncome:  reservedIncome,
		FixedCostTotal:  fixedCostTotal,
		ExpenseTotal:    expenseTotal,
		RemainingAmount: availableIncome - fixedCostTotal - expenseTotal,
		ActualBalance:   totalIncome - fixedCostTotal - expenseTotal,
	}, nil
}

// sumIncome は対象期間の収入合計を予算反映条件つきで集計する。
func (r *MonthlySummaryRepository) sumIncome(
	ctx context.Context,
	userID string,
	start time.Time,
	end time.Time,
	includedInBalance *bool,
) (int, error) {
	query := r.db.WithContext(ctx).
		Table("incomes").
		Where("user_id = ? AND income_date >= ? AND income_date < ?", userID, dateOnly(start), dateOnly(end))

	if includedInBalance != nil {
		query = query.Where("included_in_balance = ?", *includedInBalance)
	}

	total, err := scanSum(query)
	if err != nil {
		return 0, fmt.Errorf("sum income: %w", err)
	}

	return total, nil
}

// sumFixedCost は対象月に有効な固定費合計を集計する。
func (r *MonthlySummaryRepository) sumFixedCost(ctx context.Context, userID string, monthStart time.Time) (int, error) {
	total, err := scanSum(r.db.WithContext(ctx).
		Table("fixed_costs").
		Where("user_id = ? AND is_active = ? AND start_month <= ?", userID, true, dateOnly(monthStart)))
	if err != nil {
		return 0, fmt.Errorf("sum fixed cost: %w", err)
	}

	return total, nil
}

// sumExpense は対象期間の出費合計を集計する。
func (r *MonthlySummaryRepository) sumExpense(ctx context.Context, userID string, start, end time.Time) (int, error) {
	total, err := scanSum(r.db.WithContext(ctx).
		Table("expenses").
		Where("user_id = ? AND spent_at >= ? AND spent_at < ?", userID, start, end))
	if err != nil {
		return 0, fmt.Errorf("sum expense: %w", err)
	}

	return total, nil
}

// scanSum はSUM queryのNULL結果を0としてintへscanする。
func scanSum(query *gorm.DB) (int, error) {
	var total int
	if err := query.Select("COALESCE(SUM(amount), 0)").Scan(&total).Error; err != nil {
		return 0, err
	}

	return total, nil
}

// dateOnly は日付比較用に時刻を含まないYYYY-MM-DD文字列へ変換する。
func dateOnly(value time.Time) string {
	return value.Format("2006-01-02")
}
