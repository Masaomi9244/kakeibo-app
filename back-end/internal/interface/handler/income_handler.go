package handler

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	incomeusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/income"
)

// IncomeHandler は収入APIのHTTP境界を担当する。
type IncomeHandler struct {
	createUsecase *incomeusecase.CreateIncomeUsecase
	listUsecase   *incomeusecase.ListIncomesUsecase
	updateUsecase *incomeusecase.UpdateIncomeUsecase
	deleteUsecase *incomeusecase.DeleteIncomeUsecase
	location      *time.Location
}

// NewIncomeHandler は収入API handlerを作成する。
func NewIncomeHandler(
	createUsecase *incomeusecase.CreateIncomeUsecase,
	listUsecase *incomeusecase.ListIncomesUsecase,
	updateUsecase *incomeusecase.UpdateIncomeUsecase,
	deleteUsecase *incomeusecase.DeleteIncomeUsecase,
	location *time.Location,
) *IncomeHandler {
	return &IncomeHandler{
		createUsecase: createUsecase,
		listUsecase:   listUsecase,
		updateUsecase: updateUsecase,
		deleteUsecase: deleteUsecase,
		location:      location,
	}
}

// Create は収入登録requestを受け取り、登録結果を返す。
func (h *IncomeHandler) Create(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	var request dto.CreateIncomeRequest
	if bindErr := c.Bind(&request); bindErr != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	createdIncome, err := h.createUsecase.Execute(c.Request().Context(), userID, incomeusecase.CreateIncomeInput{
		Amount:            request.Amount,
		IncomeDate:        request.IncomeDate,
		Memo:              request.Memo,
		IncludedInBalance: request.IncludedInBalance,
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusCreated, dto.IncomeResponse{
		Income: toIncomeDTO(createdIncome, h.location),
	})
}

// List はmonth queryで収入一覧を取得する。
func (h *IncomeHandler) List(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	incomes, err := h.listUsecase.Execute(c.Request().Context(), userID, incomeusecase.ListIncomesInput{
		Month: c.QueryParam("month"),
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.ListIncomesResponse{
		Items: toIncomeDTOs(incomes, h.location),
	})
}

// Update はidとuserIDで対象を特定し、収入を更新する。
func (h *IncomeHandler) Update(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	var request dto.UpdateIncomeRequest
	if bindErr := c.Bind(&request); bindErr != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	updatedIncome, err := h.updateUsecase.Execute(c.Request().Context(), userID, incomeusecase.UpdateIncomeInput{
		ID:                c.Param("id"),
		Amount:            request.Amount,
		IncomeDate:        request.IncomeDate,
		Memo:              request.Memo,
		IncludedInBalance: request.IncludedInBalance,
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.IncomeResponse{
		Income: toIncomeDTO(updatedIncome, h.location),
	})
}

// Delete はidとuserIDで対象を特定し、収入を削除する。
func (h *IncomeHandler) Delete(c echo.Context) error {
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
