package income

import (
	"context"
	"fmt"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/income"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

// DeleteIncomeUsecase は対象ユーザーの収入を削除する。
type DeleteIncomeUsecase struct {
	repository income.Repository
}

// NewDeleteIncomeUsecase は収入削除usecaseを作成する。
func NewDeleteIncomeUsecase(repository income.Repository) *DeleteIncomeUsecase {
	return &DeleteIncomeUsecase{repository: repository}
}

// Execute はidとuserIDで削除対象を特定し、存在しない場合はnot foundを返す。
func (u *DeleteIncomeUsecase) Execute(ctx context.Context, userID, id string) error {
	if id == "" {
		return fmt.Errorf("%w: id is required", apperror.ErrValidation)
	}

	deleted, err := u.repository.Delete(ctx, userID, id)
	if err != nil {
		return fmt.Errorf("delete income: %w", err)
	}

	if !deleted {
		return fmt.Errorf("%w: income", apperror.ErrNotFound)
	}

	return nil
}
