package persistence

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
)

// ExpenseRepository はGORMで出費を永続化する。
type ExpenseRepository struct {
	db *gorm.DB
}

// NewExpenseRepository は出費repositoryを作成する。
func NewExpenseRepository(db *gorm.DB) *ExpenseRepository {
	return &ExpenseRepository{db: db}
}

// Create はDB側UUIDを利用して出費を登録する。
func (r *ExpenseRepository) Create(ctx context.Context, userID string, amount int, spentAt time.Time) (expense.Expense, error) {
	model := expenseModel{
		UserID:  userID,
		Amount:  amount,
		SpentAt: spentAt,
	}

	if err := r.db.WithContext(ctx).Create(&model).Error; err != nil {
		return expense.Expense{}, fmt.Errorf("create expense: %w", err)
	}

	return toExpense(model), nil
}

// ListByMonth は指定月の出費を新しい順に返す。
func (r *ExpenseRepository) ListByMonth(ctx context.Context, userID string, start, end time.Time) ([]expense.Expense, error) {
	return r.listByPeriod(ctx, userID, start, end)
}

// ListByDate は指定日の出費を新しい順に返す。
func (r *ExpenseRepository) ListByDate(ctx context.Context, userID string, start, end time.Time) ([]expense.Expense, error) {
	return r.listByPeriod(ctx, userID, start, end)
}

// Delete はidとuserIDで削除対象を絞り、削除できたかを返す。
func (r *ExpenseRepository) Delete(ctx context.Context, userID, id string) (bool, error) {
	result := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&expenseModel{})
	if result.Error != nil {
		return false, fmt.Errorf("delete expense: %w", result.Error)
	}

	return result.RowsAffected > 0, nil
}

func (r *ExpenseRepository) listByPeriod(ctx context.Context, userID string, start, end time.Time) ([]expense.Expense, error) {
	var models []expenseModel
	if err := r.db.WithContext(ctx).
		Where("user_id = ? AND spent_at >= ? AND spent_at < ?", userID, start, end).
		Order("spent_at DESC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list expenses: %w", err)
	}

	expenses := make([]expense.Expense, 0, len(models))
	for _, model := range models {
		expenses = append(expenses, toExpense(model))
	}

	return expenses, nil
}

func toExpense(model expenseModel) expense.Expense {
	return expense.Expense{
		ID:      model.ID,
		Amount:  model.Amount,
		SpentAt: model.SpentAt,
	}
}
