package income

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/income"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

const maxMemoLength = 255

// CreateIncomeInput は収入登録に必要な入力を表す。
type CreateIncomeInput struct {
	Memo              *string
	IncludedInBalance *bool
	IncomeDate        string
	Amount            int
}

// CreateIncomeUsecase は対象ユーザーの収入を登録する。
type CreateIncomeUsecase struct {
	repository income.Repository
	location   *time.Location
}

// NewCreateIncomeUsecase は収入登録usecaseを作成する。
func NewCreateIncomeUsecase(repository income.Repository, location *time.Location) *CreateIncomeUsecase {
	return &CreateIncomeUsecase{
		repository: repository,
		location:   location,
	}
}

// Execute は入力値を検証し、対象ユーザーの収入を登録する。
func (u *CreateIncomeUsecase) Execute(ctx context.Context, userID string, input CreateIncomeInput) (income.Income, error) {
	normalized, err := u.normalize(input)
	if err != nil {
		return income.Income{}, err
	}

	createdIncome, err := u.repository.Create(ctx, income.CreateInput{
		UserID:            userID,
		Amount:            normalized.amount,
		IncomeDate:        normalized.incomeDate,
		Memo:              normalized.memo,
		IncludedInBalance: normalized.includedInBalance,
	})
	if err != nil {
		return income.Income{}, fmt.Errorf("create income: %w", err)
	}

	return createdIncome, nil
}

// normalize は収入登録入力を検証し、永続化用の値へ正規化する。
func (u *CreateIncomeUsecase) normalize(input CreateIncomeInput) (normalizedIncomeInput, error) {
	if input.Amount <= 0 {
		return normalizedIncomeInput{}, fmt.Errorf("%w: amount must be greater than 0", apperror.ErrValidation)
	}

	if input.IncludedInBalance == nil {
		return normalizedIncomeInput{}, fmt.Errorf("%w: includedInBalance is required", apperror.ErrValidation)
	}

	period, err := dateperiod.ParseDate(input.IncomeDate, u.location)
	if err != nil {
		return normalizedIncomeInput{}, err
	}

	memo, err := normalizeMemo(input.Memo)
	if err != nil {
		return normalizedIncomeInput{}, err
	}

	return normalizedIncomeInput{
		incomeDate:        period.Start,
		memo:              memo.value,
		amount:            input.Amount,
		includedInBalance: *input.IncludedInBalance,
	}, nil
}

// normalizedIncomeInput は検証済みの収入登録入力を表す。
type normalizedIncomeInput struct {
	memo              *string
	incomeDate        time.Time
	amount            int
	includedInBalance bool
}

// normalizedMemo は空文字をnilへ寄せた収入メモを表す。
type normalizedMemo struct {
	value *string
}

// normalizeMemo は任意の収入メモをtrimし、空文字と最大長を検証する。
func normalizeMemo(value *string) (normalizedMemo, error) {
	if value == nil {
		return normalizedMemo{}, nil
	}

	memo := strings.TrimSpace(*value)
	if memo == "" {
		return normalizedMemo{}, nil
	}

	if len([]rune(memo)) > maxMemoLength {
		return normalizedMemo{}, fmt.Errorf("%w: memo must be less than or equal to 255 characters", apperror.ErrValidation)
	}

	return normalizedMemo{value: &memo}, nil
}
