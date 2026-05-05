package expense

import "time"

// Clock は出費登録日時をテスト可能にするための時刻取得境界を表す。
type Clock interface {
	Now() time.Time
}

type realClock struct{}

// NewRealClock は実時刻を返すClockを作成する。
func NewRealClock() Clock {
	return realClock{}
}

func (c realClock) Now() time.Time {
	return time.Now()
}
