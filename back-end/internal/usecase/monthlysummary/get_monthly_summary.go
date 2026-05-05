package monthlysummary

import (
	"context"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

// GetMonthlySummaryUsecase は対象月の月次サマリーを取得する。
type GetMonthlySummaryUsecase struct {
	repository monthlysummary.Repository
	location   *time.Location
}

// NewGetMonthlySummaryUsecase は月次サマリー取得usecaseを作成する。
func NewGetMonthlySummaryUsecase(repository monthlysummary.Repository, location *time.Location) *GetMonthlySummaryUsecase {
	return &GetMonthlySummaryUsecase{
		repository: repository,
		location:   location,
	}
}

// Execute はYYYY-MM形式の月を検証し、対象ユーザーの月次サマリーを返す。
func (u *GetMonthlySummaryUsecase) Execute(ctx context.Context, userID, month string) (monthlysummary.MonthlySummary, error) {
	period, err := dateperiod.ParseMonth(month, u.location)
	if err != nil {
		return monthlysummary.MonthlySummary{}, err
	}

	return u.repository.Get(ctx, userID, period.Value, period.Start, period.End)
}
