package monthlysummary

import (
	"context"
	"time"
)

// MonthlySummary は対象月の収入、固定費、出費、残額の正計算結果を表す。
type MonthlySummary struct {
	Month           string
	TotalIncome     int
	AvailableIncome int
	ReservedIncome  int
	FixedCostTotal  int
	ExpenseTotal    int
	RemainingAmount int
	ActualBalance   int
}

// Repository は月次サマリーに必要なDB集計を行う。
type Repository interface {
	Get(ctx context.Context, userID, month string, start, end time.Time) (MonthlySummary, error)
}
