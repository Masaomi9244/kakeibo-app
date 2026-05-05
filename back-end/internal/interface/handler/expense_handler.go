package handler

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	expenseusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/expense"
)

// ExpenseHandler は出費APIのHTTP境界を担当する。
type ExpenseHandler struct {
	createUsecase *expenseusecase.CreateExpenseUsecase
	listUsecase   *expenseusecase.ListExpensesUsecase
	deleteUsecase *expenseusecase.DeleteExpenseUsecase
	location      *time.Location
}

// NewExpenseHandler は出費API handlerを作成する。
func NewExpenseHandler(
	createUsecase *expenseusecase.CreateExpenseUsecase,
	listUsecase *expenseusecase.ListExpensesUsecase,
	deleteUsecase *expenseusecase.DeleteExpenseUsecase,
	location *time.Location,
) *ExpenseHandler {
	return &ExpenseHandler{
		createUsecase: createUsecase,
		listUsecase:   listUsecase,
		deleteUsecase: deleteUsecase,
		location:      location,
	}
}

// Create は金額のみの出費登録requestを受け取り、登録結果と月次サマリーを返す。
func (h *ExpenseHandler) Create(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	var request dto.CreateExpenseRequest
	if bindErr := c.Bind(&request); bindErr != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	output, err := h.createUsecase.Execute(c.Request().Context(), userID, expenseusecase.CreateExpenseInput{
		Amount: request.Amount,
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusCreated, dto.CreateExpenseResponse{
		Expense:        toExpenseDTO(output.Expense, h.location),
		MonthlySummary: toMonthlySummaryDTO(output.MonthlySummary),
	})
}

// List はmonthまたはdate queryで出費一覧を取得する。
func (h *ExpenseHandler) List(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	expenses, err := h.listUsecase.Execute(c.Request().Context(), userID, expenseusecase.ListExpensesInput{
		Month: c.QueryParam("month"),
		Date:  c.QueryParam("date"),
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.ListExpensesResponse{
		Items: toExpenseDTOs(expenses, h.location),
	})
}

// Delete はidとuserIDで対象を特定し、出費を削除する。
func (h *ExpenseHandler) Delete(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	if err := h.deleteUsecase.Execute(c.Request().Context(), userID, c.Param("id")); err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "削除しました",
	})
}
