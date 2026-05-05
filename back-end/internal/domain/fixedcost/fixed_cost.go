package fixedcost

import (
	"context"
	"time"
)

// FixedCost は固定費を表す。
type FixedCost struct {
	StartMonth time.Time
	ID         string
	Name       string
	Amount     int
	IsActive   bool
}

// Repository は固定費の永続化境界を表す。
type Repository interface {
	Create(ctx context.Context, input CreateInput) (FixedCost, error)
	ListByMonth(ctx context.Context, userID string, monthStart time.Time) ([]FixedCost, error)
	Update(ctx context.Context, input UpdateInput) (FixedCost, bool, error)
	Delete(ctx context.Context, userID, id string) (bool, error)
}

// CreateInput は固定費登録に必要な永続化入力を表す。
type CreateInput struct {
	StartMonth time.Time
	UserID     string
	Name       string
	Amount     int
	IsActive   bool
}

// UpdateInput は固定費更新に必要な永続化入力を表す。
type UpdateInput struct {
	StartMonth time.Time
	ID         string
	UserID     string
	Name       string
	Amount     int
	IsActive   bool
}
