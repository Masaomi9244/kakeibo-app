package income

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/income"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

// UpdateIncomeInput は収入更新に必要な入力を表す。
type UpdateIncomeInput struct {
	IncomeDate        string
	Memo              *string
	IncludedInBalance *bool
	ID                string
	Amount            int
}

// UpdateIncomeUsecase は対象ユーザーの収入を更新する。
type UpdateIncomeUsecase struct {
	createUsecase *CreateIncomeUsecase
	repository    income.Repository
}

// NewUpdateIncomeUsecase は収入更新usecaseを作成する。
func NewUpdateIncomeUsecase(repository income.Repository, location *time.Location) *UpdateIncomeUsecase {
	return &UpdateIncomeUsecase{
		createUsecase: NewCreateIncomeUsecase(repository, location),
		repository:    repository,
	}
}

// Execute はidとuserIDで対象を特定し、収入を更新する。
func (u *UpdateIncomeUsecase) Execute(ctx context.Context, userID string, input UpdateIncomeInput) (income.Income, error) {
	if input.ID == "" {
		return income.Income{}, fmt.Errorf("%w: id is required", apperror.ErrValidation)
	}

	normalized, err := u.createUsecase.normalize(CreateIncomeInput{
		Amount:            input.Amount,
		IncomeDate:        input.IncomeDate,
		Memo:              input.Memo,
		IncludedInBalance: input.IncludedInBalance,
	})
	if err != nil {
		return income.Income{}, err
	}

	updatedIncome, found, err := u.repository.Update(ctx, income.UpdateInput{
		ID:                input.ID,
		UserID:            userID,
		Amount:            normalized.amount,
		IncomeDate:        normalized.incomeDate,
		Memo:              normalized.memo,
		IncludedInBalance: normalized.includedInBalance,
	})
	if err != nil {
		return income.Income{}, fmt.Errorf("update income: %w", err)
	}

	if !found {
		return income.Income{}, fmt.Errorf("%w: income", apperror.ErrNotFound)
	}

	return updatedIncome, nil
}
