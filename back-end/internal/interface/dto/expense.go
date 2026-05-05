package dto

// Expense はAPIレスポンス用の出費DTOを表す。
type Expense struct {
	ID      string `json:"id"`
	SpentAt string `json:"spentAt"`
	Amount  int    `json:"amount"`
}

// CreateExpenseRequest は出費登録requestを表す。
type CreateExpenseRequest struct {
	Amount int `json:"amount"`
}

// CreateExpenseResponse は出費登録responseを表す。
type CreateExpenseResponse struct {
	Expense        Expense        `json:"expense"`
	MonthlySummary MonthlySummary `json:"monthlySummary"`
}

// ListExpensesResponse は出費一覧responseを表す。
type ListExpensesResponse struct {
	Items []Expense `json:"items"`
}
