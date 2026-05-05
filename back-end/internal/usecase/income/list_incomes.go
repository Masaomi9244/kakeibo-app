package income

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/income"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

// ListIncomesInput は月別収入一覧取得条件を表す。
type ListIncomesInput struct {
	Month string
}

// ListIncomesUsecase は対象月の収入一覧を取得する。
type ListIncomesUsecase struct {
	repository income.Repository
	location   *time.Location
}

// NewListIncomesUsecase は収入一覧取得usecaseを作成する。
func NewListIncomesUsecase(repository income.Repository, location *time.Location) *ListIncomesUsecase {
	return &ListIncomesUsecase{
		repository: repository,
		location:   location,
	}
}

// Execute はmonthを検証し、対象月の収入一覧を返す。
func (u *ListIncomesUsecase) Execute(ctx context.Context, userID string, input ListIncomesInput) ([]income.Income, error) {
	if input.Month == "" {
		return nil, fmt.Errorf("%w: month is required", apperror.ErrValidation)
	}

	period, err := dateperiod.ParseMonth(input.Month, u.location)
	if err != nil {
		return nil, err
	}

	return u.repository.ListByMonth(ctx, userID, period.Start, period.End)
}
