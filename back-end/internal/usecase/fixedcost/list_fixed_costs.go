package fixedcost

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/fixedcost"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

// ListFixedCostsInput は対象月の固定費一覧取得条件を表す。
type ListFixedCostsInput struct {
	Month string
}

// ListFixedCostsUsecase は対象月に有効な固定費一覧を取得する。
type ListFixedCostsUsecase struct {
	repository fixedcost.Repository
	location   *time.Location
}

// NewListFixedCostsUsecase は固定費一覧取得usecaseを作成する。
func NewListFixedCostsUsecase(repository fixedcost.Repository, location *time.Location) *ListFixedCostsUsecase {
	return &ListFixedCostsUsecase{
		repository: repository,
		location:   location,
	}
}

// Execute はmonthを検証し、対象月に有効な固定費一覧を返す。
func (u *ListFixedCostsUsecase) Execute(ctx context.Context, userID string, input ListFixedCostsInput) ([]fixedcost.FixedCost, error) {
	if input.Month == "" {
		return nil, fmt.Errorf("%w: month is required", apperror.ErrValidation)
	}

	period, err := dateperiod.ParseMonth(input.Month, u.location)
	if err != nil {
		return nil, err
	}

	return u.repository.ListByMonth(ctx, userID, period.Start)
}
