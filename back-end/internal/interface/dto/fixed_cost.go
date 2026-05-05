package dto

// FixedCost はAPIレスポンス用の固定費DTOを表す。
type FixedCost struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	StartMonth string `json:"startMonth"`
	Amount     int    `json:"amount"`
	IsActive   bool   `json:"isActive"`
}

// CreateFixedCostRequest は固定費登録requestを表す。
type CreateFixedCostRequest struct {
	IsActive   *bool  `json:"isActive"`
	Name       string `json:"name"`
	StartMonth string `json:"startMonth"`
	Amount     int    `json:"amount"`
}

// UpdateFixedCostRequest は固定費更新requestを表す。
type UpdateFixedCostRequest struct {
	IsActive   *bool  `json:"isActive"`
	Name       string `json:"name"`
	StartMonth string `json:"startMonth"`
	Amount     int    `json:"amount"`
}

// FixedCostResponse は単一固定費responseを表す。
type FixedCostResponse struct {
	FixedCost FixedCost `json:"fixedCost"`
}

// ListFixedCostsResponse は固定費一覧responseを表す。
type ListFixedCostsResponse struct {
	Items []FixedCost `json:"items"`
}
