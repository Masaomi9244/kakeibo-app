package expense

import (
	"context"
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
)

// CreateExpenseInput は出費登録に必要な入力を表す。
type CreateExpenseInput struct {
	Amount int
}

// CreateExpenseOutput は出費登録後にホーム画面更新へ必要な情報を表す。
type CreateExpenseOutput struct {
	Expense        expense.Expense
	MonthlySummary monthlysummary.MonthlySummary
}

// CreateExpenseUsecase はログインユーザーの出費を登録し、対象月サマリーを返す。
type CreateExpenseUsecase struct {
	expenseRepository expense.Repository
	summaryRepository monthlysummary.Repository
	clock             Clock
	location          *time.Location
}

// NewCreateExpenseUsecase は出費登録usecaseを作成する。
func NewCreateExpenseUsecase(
	expenseRepository expense.Repository,
	summaryRepository monthlysummary.Repository,
	clock Clock,
	location *time.Location,
) *CreateExpenseUsecase {
	return &CreateExpenseUsecase{
		expenseRepository: expenseRepository,
		summaryRepository: summaryRepository,
		clock:             clock,
		location:          location,
	}
}

// Execute は金額を検証し、サーバー側時刻で出費を登録する。
func (u *CreateExpenseUsecase) Execute(ctx context.Context, userID string, input CreateExpenseInput) (CreateExpenseOutput, error) {
	if input.Amount <= 0 {
		return CreateExpenseOutput{}, fmt.Errorf("%w: amount must be greater than 0", apperror.ErrValidation)
	}

	spentAt := u.clock.Now().In(u.location)
	createdExpense, err := u.expenseRepository.Create(ctx, userID, input.Amount, spentAt)
	if err != nil {
		return CreateExpenseOutput{}, fmt.Errorf("create expense: %w", err)
	}

	period := dateperiod.MonthFromTime(spentAt, u.location)
	summary, err := u.summaryRepository.Get(ctx, userID, period.Value, period.Start, period.End)
	if err != nil {
		return CreateExpenseOutput{}, fmt.Errorf("get monthly summary after create expense: %w", err)
	}

	return CreateExpenseOutput{
		Expense:        createdExpense,
		MonthlySummary: summary,
	}, nil
}
