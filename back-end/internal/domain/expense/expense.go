package expense

import (
	"context"
	"time"
)

// Expense はトップ画面から金額のみで登録される出費を表す。
type Expense struct {
	SpentAt time.Time
	ID      string
	Amount  int
}

// Repository はuserIDで認可境界を守りながら出費を永続化する。
type Repository interface {
	Create(ctx context.Context, userID string, amount int, spentAt time.Time) (Expense, error)
	ListByMonth(ctx context.Context, userID string, start, end time.Time) ([]Expense, error)
	ListByDate(ctx context.Context, userID string, start, end time.Time) ([]Expense, error)
	Delete(ctx context.Context, userID, id string) (bool, error)
}
