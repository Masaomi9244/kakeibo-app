package dateperiod

import (
	"fmt"
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

const (
	monthLayout = "2006-01"
	dateLayout  = "2006-01-02"
)

// MonthPeriod はAsia/Tokyo基準の月次検索範囲を表す。
type MonthPeriod struct {
	Start time.Time
	End   time.Time
	Value string
}

// DatePeriod はAsia/Tokyo基準の日次検索範囲を表す。
type DatePeriod struct {
	Start time.Time
	End   time.Time
	Value string
}

// AsiaTokyo は集計と表示の基準タイムゾーンを返す。
func AsiaTokyo() *time.Location {
	return time.FixedZone("Asia/Tokyo", 9*60*60)
}

// MonthFromTime は指定時刻が属する月の検索範囲を返す。
func MonthFromTime(target time.Time, location *time.Location) MonthPeriod {
	start := time.Date(target.In(location).Year(), target.In(location).Month(), 1, 0, 0, 0, 0, location)

	return MonthPeriod{
		Value: start.Format(monthLayout),
		Start: start,
		End:   start.AddDate(0, 1, 0),
	}
}

// ParseMonth はYYYY-MM形式を月次検索範囲へ変換する。
func ParseMonth(value string, location *time.Location) (MonthPeriod, error) {
	start, err := time.ParseInLocation(monthLayout, value, location)
	if err != nil {
		return MonthPeriod{}, fmt.Errorf("%w: invalid month", apperror.ErrValidation)
	}

	return MonthPeriod{
		Value: start.Format(monthLayout),
		Start: start,
		End:   start.AddDate(0, 1, 0),
	}, nil
}

// ParseDate はYYYY-MM-DD形式を日次検索範囲へ変換する。
func ParseDate(value string, location *time.Location) (DatePeriod, error) {
	start, err := time.ParseInLocation(dateLayout, value, location)
	if err != nil {
		return DatePeriod{}, fmt.Errorf("%w: invalid date", apperror.ErrValidation)
	}

	return DatePeriod{
		Value: start.Format(dateLayout),
		Start: start,
		End:   start.AddDate(0, 0, 1),
	}, nil
}
