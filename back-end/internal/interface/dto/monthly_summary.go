package dto

// MonthlySummary はAPIレスポンス用の月次サマリーDTOを表す。
type MonthlySummary struct {
	Month           string `json:"month"`
	TotalIncome     int    `json:"totalIncome"`
	AvailableIncome int    `json:"availableIncome"`
	ReservedIncome  int    `json:"reservedIncome"`
	FixedCostTotal  int    `json:"fixedCostTotal"`
	ExpenseTotal    int    `json:"expenseTotal"`
	RemainingAmount int    `json:"remainingAmount"`
	ActualBalance   int    `json:"actualBalance"`
}

// GetMonthlySummaryResponse は月次サマリー取得responseを表す。
type GetMonthlySummaryResponse struct {
	MonthlySummary MonthlySummary `json:"monthlySummary"`
}
