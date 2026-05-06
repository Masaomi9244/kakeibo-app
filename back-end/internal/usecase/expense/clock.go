package expense

import "time"

// Clock は出費登録日時をテスト可能にするための時刻取得境界を表す。
type Clock interface {
	Now() time.Time
}

// realClock は実システム時刻を返すClock実装を表す。
type realClock struct{}

// NewRealClock は実時刻を返すClockを作成する。
func NewRealClock() Clock {
	return realClock{}
}

// Now は現在の実システム時刻を返す。
func (c realClock) Now() time.Time {
	return time.Now()
}
