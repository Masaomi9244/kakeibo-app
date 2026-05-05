package dto

// ExpenseCalendar はAPIレスポンス用のカレンダーDTOを表す。
type ExpenseCalendar struct {
	Month                string               `json:"month"`
	Days                 []ExpenseCalendarDay `json:"days"`
	SelectedDateExpenses []Expense            `json:"selectedDateExpenses"`
	AvailableIncome      int                  `json:"availableIncome"`
	FixedCostTotal       int                  `json:"fixedCostTotal"`
	ExpenseTotal         int                  `json:"expenseTotal"`
	RemainingAmount      int                  `json:"remainingAmount"`
}

// ExpenseCalendarDay は対象日の出費合計と残額を表す。
type ExpenseCalendarDay struct {
	Date            string `json:"date"`
	ExpenseTotal    int    `json:"expenseTotal"`
	RemainingAmount int    `json:"remainingAmount"`
}

// GetExpenseCalendarResponse はカレンダー取得responseを表す。
type GetExpenseCalendarResponse struct {
	ExpenseCalendar ExpenseCalendar `json:"expenseCalendar"`
}
