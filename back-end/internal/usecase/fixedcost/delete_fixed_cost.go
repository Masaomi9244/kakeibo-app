package fixedcost

import (
	"context"
	"fmt"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/fixedcost"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

// DeleteFixedCostUsecase は対象ユーザーの固定費を削除する。
type DeleteFixedCostUsecase struct {
	repository fixedcost.Repository
}

// NewDeleteFixedCostUsecase は固定費削除usecaseを作成する。
func NewDeleteFixedCostUsecase(repository fixedcost.Repository) *DeleteFixedCostUsecase {
	return &DeleteFixedCostUsecase{repository: repository}
}

// Execute はidとuserIDで削除対象を特定し、存在しない場合はnot foundを返す。
func (u *DeleteFixedCostUsecase) Execute(ctx context.Context, userID, id string) error {
	if id == "" {
		return fmt.Errorf("%w: id is required", apperror.ErrValidation)
	}

	deleted, err := u.repository.Delete(ctx, userID, id)
	if err != nil {
		return fmt.Errorf("delete fixed cost: %w", err)
	}

	if !deleted {
		return fmt.Errorf("%w: fixed cost", apperror.ErrNotFound)
	}

	return nil
}
