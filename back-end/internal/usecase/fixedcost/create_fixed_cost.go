package fixedcost

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/fixedcost"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

// CreateFixedCostInput は固定費登録に必要な入力を表す。
type CreateFixedCostInput struct {
	IsActive   *bool
	Name       string
	StartMonth string
	Amount     int
}

// CreateFixedCostUsecase は対象ユーザーの固定費を登録する。
type CreateFixedCostUsecase struct {
	repository fixedcost.Repository
	location   *time.Location
}

// NewCreateFixedCostUsecase は固定費登録usecaseを作成する。
func NewCreateFixedCostUsecase(repository fixedcost.Repository, location *time.Location) *CreateFixedCostUsecase {
	return &CreateFixedCostUsecase{
		repository: repository,
		location:   location,
	}
}

// Execute は入力値を検証し、固定費を登録する。
func (u *CreateFixedCostUsecase) Execute(ctx context.Context, userID string, input CreateFixedCostInput) (fixedcost.FixedCost, error) {
	normalized, err := u.normalize(input)
	if err != nil {
		return fixedcost.FixedCost{}, err
	}

	createdFixedCost, err := u.repository.Create(ctx, fixedcost.CreateInput{
		UserID:     userID,
		Name:       normalized.name,
		Amount:     normalized.amount,
		StartMonth: normalized.startMonth,
		IsActive:   normalized.isActive,
	})
	if err != nil {
		return fixedcost.FixedCost{}, fmt.Errorf("create fixed cost: %w", err)
	}

	return createdFixedCost, nil
}

// normalize は固定費登録入力を検証し、永続化用の値へ正規化する。
func (u *CreateFixedCostUsecase) normalize(input CreateFixedCostInput) (normalizedFixedCostInput, error) {
	name := strings.TrimSpace(input.Name)
	if name == "" {
		return normalizedFixedCostInput{}, fmt.Errorf("%w: name is required", apperror.ErrValidation)
	}

	if input.Amount <= 0 {
		return normalizedFixedCostInput{}, fmt.Errorf("%w: amount must be greater than 0", apperror.ErrValidation)
	}

	if input.IsActive == nil {
		return normalizedFixedCostInput{}, fmt.Errorf("%w: isActive is required", apperror.ErrValidation)
	}

	period, err := dateperiod.ParseMonthStart(input.StartMonth, u.location)
	if err != nil {
		return normalizedFixedCostInput{}, err
	}

	return normalizedFixedCostInput{
		startMonth: period.Start,
		name:       name,
		amount:     input.Amount,
		isActive:   *input.IsActive,
	}, nil
}

// normalizedFixedCostInput は検証済みの固定費登録入力を表す。
type normalizedFixedCostInput struct {
	startMonth time.Time
	name       string
	amount     int
	isActive   bool
}
