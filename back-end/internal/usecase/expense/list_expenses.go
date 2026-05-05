package expense

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

// ListExpensesInput は月別または日別の出費一覧取得条件を表す。
type ListExpensesInput struct {
	Month string
	Date  string
}

// ListExpensesUsecase は対象月または対象日の出費一覧を取得する。
type ListExpensesUsecase struct {
	repository expense.Repository
	location   *time.Location
}

// NewListExpensesUsecase は出費一覧取得usecaseを作成する。
func NewListExpensesUsecase(repository expense.Repository, location *time.Location) *ListExpensesUsecase {
	return &ListExpensesUsecase{
		repository: repository,
		location:   location,
	}
}

// Execute はmonthまたはdateのどちらか一方を検証し、対象出費一覧を返す。
func (u *ListExpensesUsecase) Execute(ctx context.Context, userID string, input ListExpensesInput) ([]expense.Expense, error) {
	if input.Month != "" && input.Date != "" {
		return nil, fmt.Errorf("%w: month and date cannot be used together", apperror.ErrValidation)
	}

	if input.Month == "" && input.Date == "" {
		return nil, fmt.Errorf("%w: month or date is required", apperror.ErrValidation)
	}

	if input.Month != "" {
		period, err := dateperiod.ParseMonth(input.Month, u.location)
		if err != nil {
			return nil, err
		}

		return u.repository.ListByMonth(ctx, userID, period.Start, period.End)
	}

	period, err := dateperiod.ParseDate(input.Date, u.location)
	if err != nil {
		return nil, err
	}

	return u.repository.ListByDate(ctx, userID, period.Start, period.End)
}
