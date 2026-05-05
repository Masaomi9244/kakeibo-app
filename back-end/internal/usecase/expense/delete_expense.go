package expense

import (
	"context"
	"fmt"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

// DeleteExpenseUsecase は対象ユーザーの出費を削除する。
type DeleteExpenseUsecase struct {
	repository expense.Repository
}

// NewDeleteExpenseUsecase は出費削除usecaseを作成する。
func NewDeleteExpenseUsecase(repository expense.Repository) *DeleteExpenseUsecase {
	return &DeleteExpenseUsecase{repository: repository}
}

// Execute はidとuserIDで削除対象を特定し、存在しない場合はnot foundを返す。
func (u *DeleteExpenseUsecase) Execute(ctx context.Context, userID, id string) error {
	if id == "" {
		return fmt.Errorf("%w: id is required", apperror.ErrValidation)
	}

	deleted, err := u.repository.Delete(ctx, userID, id)
	if err != nil {
		return fmt.Errorf("delete expense: %w", err)
	}

	if !deleted {
		return fmt.Errorf("%w: expense", apperror.ErrNotFound)
	}

	return nil
}
