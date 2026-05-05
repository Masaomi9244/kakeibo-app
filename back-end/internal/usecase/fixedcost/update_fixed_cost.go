package fixedcost

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/fixedcost"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

// UpdateFixedCostInput は固定費更新に必要な入力を表す。
type UpdateFixedCostInput struct {
	IsActive   *bool
	ID         string
	Name       string
	StartMonth string
	Amount     int
}

// UpdateFixedCostUsecase は対象ユーザーの固定費を更新する。
type UpdateFixedCostUsecase struct {
	createUsecase *CreateFixedCostUsecase
	repository    fixedcost.Repository
}

// NewUpdateFixedCostUsecase は固定費更新usecaseを作成する。
func NewUpdateFixedCostUsecase(repository fixedcost.Repository, location *time.Location) *UpdateFixedCostUsecase {
	return &UpdateFixedCostUsecase{
		createUsecase: NewCreateFixedCostUsecase(repository, location),
		repository:    repository,
	}
}

// Execute はidとuserIDで対象を特定し、固定費を更新する。
func (u *UpdateFixedCostUsecase) Execute(ctx context.Context, userID string, input UpdateFixedCostInput) (fixedcost.FixedCost, error) {
	if input.ID == "" {
		return fixedcost.FixedCost{}, fmt.Errorf("%w: id is required", apperror.ErrValidation)
	}

	normalized, err := u.createUsecase.normalize(CreateFixedCostInput{
		Name:       input.Name,
		Amount:     input.Amount,
		StartMonth: input.StartMonth,
		IsActive:   input.IsActive,
	})
	if err != nil {
		return fixedcost.FixedCost{}, err
	}

	updatedFixedCost, found, err := u.repository.Update(ctx, fixedcost.UpdateInput{
		ID:         input.ID,
		UserID:     userID,
		Name:       normalized.name,
		Amount:     normalized.amount,
		StartMonth: normalized.startMonth,
		IsActive:   normalized.isActive,
	})
	if err != nil {
		return fixedcost.FixedCost{}, fmt.Errorf("update fixed cost: %w", err)
	}

	if !found {
		return fixedcost.FixedCost{}, fmt.Errorf("%w: fixed cost", apperror.ErrNotFound)
	}

	return updatedFixedCost, nil
}
