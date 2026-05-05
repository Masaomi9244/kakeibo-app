package persistence

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expensecalendar"
)

// ExpenseCalendarRepository はGORMでカレンダー用出費集計を取得する。
type ExpenseCalendarRepository struct {
	db *gorm.DB
}

// NewExpenseCalendarRepository はカレンダーrepositoryを作成する。
func NewExpenseCalendarRepository(db *gorm.DB) *ExpenseCalendarRepository {
	return &ExpenseCalendarRepository{db: db}
}

// ListDailyExpenseTotals は対象月の日別出費合計を返す。
func (r *ExpenseCalendarRepository) ListDailyExpenseTotals(
	ctx context.Context,
	userID string,
	start time.Time,
	end time.Time,
) ([]expensecalendar.DailyExpenseTotal, error) {
	var rows []dailyExpenseTotalRow
	if err := r.db.WithContext(ctx).
		Table("expenses").
		Select("DATE(spent_at AT TIME ZONE 'Asia/Tokyo') AS date, COALESCE(SUM(amount), 0) AS expense_total").
		Where("user_id = ? AND spent_at >= ? AND spent_at < ?", userID, start, end).
		Group("DATE(spent_at AT TIME ZONE 'Asia/Tokyo')").
		Order("date ASC").
		Scan(&rows).Error; err != nil {
		return nil, fmt.Errorf("list daily expense totals: %w", err)
	}

	totals := make([]expensecalendar.DailyExpenseTotal, 0, len(rows))
	for _, row := range rows {
		totals = append(totals, expensecalendar.DailyExpenseTotal{
			Date:         row.Date,
			ExpenseTotal: row.ExpenseTotal,
		})
	}

	return totals, nil
}

type dailyExpenseTotalRow struct {
	Date         time.Time `gorm:"column:date"`
	ExpenseTotal int       `gorm:"column:expense_total"`
}
