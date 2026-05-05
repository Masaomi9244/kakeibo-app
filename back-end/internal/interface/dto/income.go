package dto

// Income はAPIレスポンス用の収入DTOを表す。
type Income struct {
	Memo              *string `json:"memo"`
	ID                string  `json:"id"`
	IncomeDate        string  `json:"incomeDate"`
	Amount            int     `json:"amount"`
	IncludedInBalance bool    `json:"includedInBalance"`
}

// CreateIncomeRequest は収入登録requestを表す。
type CreateIncomeRequest struct {
	IncludedInBalance *bool   `json:"includedInBalance"`
	Memo              *string `json:"memo"`
	IncomeDate        string  `json:"incomeDate"`
	Amount            int     `json:"amount"`
}

// UpdateIncomeRequest は収入更新requestを表す。
type UpdateIncomeRequest struct {
	IncludedInBalance *bool   `json:"includedInBalance"`
	Memo              *string `json:"memo"`
	IncomeDate        string  `json:"incomeDate"`
	Amount            int     `json:"amount"`
}

// IncomeResponse は単一収入responseを表す。
type IncomeResponse struct {
	Income Income `json:"income"`
}

// ListIncomesResponse は収入一覧responseを表す。
type ListIncomesResponse struct {
	Items []Income `json:"items"`
}
