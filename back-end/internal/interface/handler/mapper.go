package handler

import (
	"time"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expense"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/fixedcost"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/income"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/monthlysummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
)

const dateLayout = "2006-01-02"

func toIncomeDTO(income income.Income, location *time.Location) dto.Income {
	return dto.Income{
		ID:                income.ID,
		Amount:            income.Amount,
		IncomeDate:        income.IncomeDate.In(location).Format(dateLayout),
		Memo:              income.Memo,
		IncludedInBalance: income.IncludedInBalance,
	}
}

func toIncomeDTOs(incomes []income.Income, location *time.Location) []dto.Income {
	items := make([]dto.Income, 0, len(incomes))
	for _, income := range incomes {
		items = append(items, toIncomeDTO(income, location))
	}

	return items
}

func toFixedCostDTO(fixedCost fixedcost.FixedCost, location *time.Location) dto.FixedCost {
	return dto.FixedCost{
		ID:         fixedCost.ID,
		Name:       fixedCost.Name,
		Amount:     fixedCost.Amount,
		StartMonth: fixedCost.StartMonth.In(location).Format(dateLayout),
		IsActive:   fixedCost.IsActive,
	}
}

func toFixedCostDTOs(fixedCosts []fixedcost.FixedCost, location *time.Location) []dto.FixedCost {
	items := make([]dto.FixedCost, 0, len(fixedCosts))
	for _, fixedCost := range fixedCosts {
		items = append(items, toFixedCostDTO(fixedCost, location))
	}

	return items
}

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
