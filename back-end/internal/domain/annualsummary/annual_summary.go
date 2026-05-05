package annualsummary

// AnnualSummary は対象年の収入、固定費、出費、収支の集計結果を表す。
type AnnualSummary struct {
	Months           []MonthSummary
	Year             int
	TotalIncome      int
	AvailableIncome  int
	ReservedIncome   int
	FixedCostTotal   int
	ExpenseTotal     int
	ActualBalance    int
	AvailableBalance int
}

// MonthSummary は対象月の年間サマリー用集計結果を表す。
type MonthSummary struct {
	Month            string
	TotalIncome      int
	AvailableIncome  int
	ReservedIncome   int
	FixedCostTotal   int
	ExpenseTotal     int
	ActualBalance    int
	AvailableBalance int
}
