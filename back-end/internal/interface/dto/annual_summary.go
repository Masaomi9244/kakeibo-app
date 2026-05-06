package dto

// AnnualSummary はAPIレスポンス用の年間サマリーDTOを表す。
type AnnualSummary struct {
	Months           []AnnualMonthSummary `json:"months"`
	Year             int                  `json:"year"`
	TotalIncome      int                  `json:"totalIncome"`
	AvailableIncome  int                  `json:"availableIncome"`
	ReservedIncome   int                  `json:"reservedIncome"`
	FixedCostTotal   int                  `json:"fixedCostTotal"`
	ExpenseTotal     int                  `json:"expenseTotal"`
	ActualBalance    int                  `json:"actualBalance"`
	AvailableBalance int                  `json:"availableBalance"`
}

// AnnualMonthSummary はAPIレスポンス用の月別サマリーDTOを表す。
type AnnualMonthSummary struct {
	Month            string `json:"month"`
	TotalIncome      int    `json:"totalIncome"`
	AvailableIncome  int    `json:"availableIncome"`
	ReservedIncome   int    `json:"reservedIncome"`
	FixedCostTotal   int    `json:"fixedCostTotal"`
	ExpenseTotal     int    `json:"expenseTotal"`
	ActualBalance    int    `json:"actualBalance"`
	AvailableBalance int    `json:"availableBalance"`
}

// GetAnnualSummaryResponse は年間サマリー取得responseを表す。
type GetAnnualSummaryResponse struct {
	AnnualSummary AnnualSummary `json:"annualSummary"`
}
