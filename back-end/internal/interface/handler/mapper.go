package handler

import (
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
)

func toExpenseDTO(expense expense.Expense, location *time.Location) dto.Expense {
	return dto.Expense{
		ID:      expense.ID,
		Amount:  expense.Amount,
		SpentAt: expense.SpentAt.In(location).Format(time.RFC3339),
	}
}

func toExpenseDTOs(expenses []expense.Expense, location *time.Location) []dto.Expense {
	items := make([]dto.Expense, 0, len(expenses))
	for _, expense := range expenses {
		items = append(items, toExpenseDTO(expense, location))
	}

	return items
}

func toMonthlySummaryDTO(summary monthlysummary.MonthlySummary) dto.MonthlySummary {
	return dto.MonthlySummary{
		Month:           summary.Month,
		TotalIncome:     summary.TotalIncome,
		AvailableIncome: summary.AvailableIncome,
		ReservedIncome:  summary.ReservedIncome,
		FixedCostTotal:  summary.FixedCostTotal,
		ExpenseTotal:    summary.ExpenseTotal,
		RemainingAmount: summary.RemainingAmount,
		ActualBalance:   summary.ActualBalance,
	}
}
