package persistence

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/income"
)

// IncomeRepository はGORMで収入を永続化する。
type IncomeRepository struct {
	db *gorm.DB
}

// NewIncomeRepository は収入repositoryを作成する。
func NewIncomeRepository(db *gorm.DB) *IncomeRepository {
	return &IncomeRepository{db: db}
}

// Create はDB側UUIDを利用して収入を登録する。
func (r *IncomeRepository) Create(ctx context.Context, input income.CreateInput) (income.Income, error) {
	model := incomeModel{
		UserID:            input.UserID,
		Amount:            input.Amount,
		IncomeDate:        input.IncomeDate,
		Memo:              input.Memo,
		IncludedInBalance: input.IncludedInBalance,
	}

	if err := r.db.WithContext(ctx).Create(&model).Error; err != nil {
		return income.Income{}, fmt.Errorf("create income: %w", err)
	}

	return toIncome(model), nil
}

// ListByMonth は指定月の収入を新しい順に返す。
func (r *IncomeRepository) ListByMonth(ctx context.Context, userID string, start, end time.Time) ([]income.Income, error) {
	var models []incomeModel
	if err := r.db.WithContext(ctx).
		Where("user_id = ? AND income_date >= ? AND income_date < ?", userID, dateOnly(start), dateOnly(end)).
		Order("income_date DESC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list incomes: %w", err)
	}

	incomes := make([]income.Income, 0, len(models))
	for _, model := range models {
		incomes = append(incomes, toIncome(model))
	}

	return incomes, nil
}

// Update はidとuserIDで対象を絞り、収入を更新する。
func (r *IncomeRepository) Update(ctx context.Context, input income.UpdateInput) (income.Income, bool, error) {
	result := r.db.WithContext(ctx).
		Model(&incomeModel{}).
		Where("id = ? AND user_id = ?", input.ID, input.UserID).
		Updates(map[string]any{
			"amount":              input.Amount,
			"income_date":         dateOnly(input.IncomeDate),
			"memo":                input.Memo,
			"included_in_balance": input.IncludedInBalance,
		})
	if result.Error != nil {
		return income.Income{}, false, fmt.Errorf("update income: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return income.Income{}, false, nil
	}

	var model incomeModel
	if err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", input.ID, input.UserID).
		First(&model).Error; err != nil {
		return income.Income{}, false, fmt.Errorf("get updated income: %w", err)
	}

	return toIncome(model), true, nil
}

// Delete はidとuserIDで削除対象を絞り、削除できたかを返す。
func (r *IncomeRepository) Delete(ctx context.Context, userID, id string) (bool, error) {
	result := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&incomeModel{})
	if result.Error != nil {
		return false, fmt.Errorf("delete income: %w", result.Error)
	}

	return result.RowsAffected > 0, nil
}

// toIncome はGORM永続化modelを収入domain modelへ変換する。
func toIncome(model incomeModel) income.Income {
	return income.Income{
		ID:                model.ID,
		Amount:            model.Amount,
		IncomeDate:        model.IncomeDate,
		Memo:              model.Memo,
		IncludedInBalance: model.IncludedInBalance,
	}
}
