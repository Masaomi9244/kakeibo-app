package income

import (
	"context"
	"time"
)

// Income は収入を表す。
type Income struct {
	Memo              *string
	IncomeDate        time.Time
	ID                string
	Amount            int
	IncludedInBalance bool
}

// Repository は収入の永続化境界を表す。
type Repository interface {
	Create(ctx context.Context, input CreateInput) (Income, error)
	ListByMonth(ctx context.Context, userID string, start, end time.Time) ([]Income, error)
	Update(ctx context.Context, input UpdateInput) (Income, bool, error)
	Delete(ctx context.Context, userID, id string) (bool, error)
}

// CreateInput は収入登録に必要な永続化入力を表す。
type CreateInput struct {
	IncomeDate        time.Time
	Memo              *string
	UserID            string
	Amount            int
	IncludedInBalance bool
}

// UpdateInput は収入更新に必要な永続化入力を表す。
type UpdateInput struct {
	IncomeDate        time.Time
	Memo              *string
	ID                string
	UserID            string
	Amount            int
	IncludedInBalance bool
}
