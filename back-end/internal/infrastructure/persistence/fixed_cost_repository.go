package persistence

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/fixedcost"
)

// FixedCostRepository はGORMで固定費を永続化する。
type FixedCostRepository struct {
	db *gorm.DB
}

// NewFixedCostRepository は固定費repositoryを作成する。
func NewFixedCostRepository(db *gorm.DB) *FixedCostRepository {
	return &FixedCostRepository{db: db}
}

// Create はDB側UUIDを利用して固定費を登録する。
func (r *FixedCostRepository) Create(ctx context.Context, input fixedcost.CreateInput) (fixedcost.FixedCost, error) {
	model := fixedCostModel{
		UserID:     input.UserID,
		Name:       input.Name,
		Amount:     input.Amount,
		StartMonth: input.StartMonth,
		IsActive:   input.IsActive,
	}

	if err := r.db.WithContext(ctx).Create(&model).Error; err != nil {
		return fixedcost.FixedCost{}, fmt.Errorf("create fixed cost: %w", err)
	}

	return toFixedCost(model), nil
}

// ListByMonth は対象月に有効な固定費を開始月順に返す。
func (r *FixedCostRepository) ListByMonth(ctx context.Context, userID string, monthStart time.Time) ([]fixedcost.FixedCost, error) {
	var models []fixedCostModel
	if err := r.db.WithContext(ctx).
		Where("user_id = ? AND is_active = ? AND start_month <= ?", userID, true, dateOnly(monthStart)).
		Order("start_month ASC, created_at ASC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list fixed costs: %w", err)
	}

	fixedCosts := make([]fixedcost.FixedCost, 0, len(models))
	for _, model := range models {
		fixedCosts = append(fixedCosts, toFixedCost(model))
	}

	return fixedCosts, nil
}

// Update はidとuserIDで対象を絞り、固定費を更新する。
func (r *FixedCostRepository) Update(ctx context.Context, input fixedcost.UpdateInput) (fixedcost.FixedCost, bool, error) {
	result := r.db.WithContext(ctx).
		Model(&fixedCostModel{}).
		Where("id = ? AND user_id = ?", input.ID, input.UserID).
		Updates(map[string]any{
			"name":        input.Name,
			"amount":      input.Amount,
			"start_month": dateOnly(input.StartMonth),
			"is_active":   input.IsActive,
		})
	if result.Error != nil {
		return fixedcost.FixedCost{}, false, fmt.Errorf("update fixed cost: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fixedcost.FixedCost{}, false, nil
	}

	var model fixedCostModel
	if err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", input.ID, input.UserID).
		First(&model).Error; err != nil {
		return fixedcost.FixedCost{}, false, fmt.Errorf("get updated fixed cost: %w", err)
	}

	return toFixedCost(model), true, nil
}

// Delete はidとuserIDで削除対象を絞り、削除できたかを返す。
func (r *FixedCostRepository) Delete(ctx context.Context, userID, id string) (bool, error) {
	result := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&fixedCostModel{})
	if result.Error != nil {
		return false, fmt.Errorf("delete fixed cost: %w", result.Error)
	}

	return result.RowsAffected > 0, nil
}

// toFixedCost はGORM永続化modelを固定費domain modelへ変換する。
func toFixedCost(model fixedCostModel) fixedcost.FixedCost {
	return fixedcost.FixedCost{
		ID:         model.ID,
		Name:       model.Name,
		Amount:     model.Amount,
		StartMonth: model.StartMonth,
		IsActive:   model.IsActive,
	}
}
