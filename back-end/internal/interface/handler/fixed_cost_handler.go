package handler

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	fixedcostusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/fixedcost"
)

// FixedCostHandler は固定費APIのHTTP境界を担当する。
type FixedCostHandler struct {
	createUsecase *fixedcostusecase.CreateFixedCostUsecase
	listUsecase   *fixedcostusecase.ListFixedCostsUsecase
	updateUsecase *fixedcostusecase.UpdateFixedCostUsecase
	deleteUsecase *fixedcostusecase.DeleteFixedCostUsecase
	location      *time.Location
}

// NewFixedCostHandler は固定費API handlerを作成する。
func NewFixedCostHandler(
	createUsecase *fixedcostusecase.CreateFixedCostUsecase,
	listUsecase *fixedcostusecase.ListFixedCostsUsecase,
	updateUsecase *fixedcostusecase.UpdateFixedCostUsecase,
	deleteUsecase *fixedcostusecase.DeleteFixedCostUsecase,
	location *time.Location,
) *FixedCostHandler {
	return &FixedCostHandler{
		createUsecase: createUsecase,
		listUsecase:   listUsecase,
		updateUsecase: updateUsecase,
		deleteUsecase: deleteUsecase,
		location:      location,
	}
}

// Create は固定費登録requestを受け取り、登録結果を返す。
func (h *FixedCostHandler) Create(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	var request dto.CreateFixedCostRequest
	if bindErr := c.Bind(&request); bindErr != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	createdFixedCost, err := h.createUsecase.Execute(c.Request().Context(), userID, fixedcostusecase.CreateFixedCostInput{
		Name:       request.Name,
		Amount:     request.Amount,
		StartMonth: request.StartMonth,
		IsActive:   request.IsActive,
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusCreated, dto.FixedCostResponse{
		FixedCost: toFixedCostDTO(createdFixedCost, h.location),
	})
}

// List はmonth queryで固定費一覧を取得する。
func (h *FixedCostHandler) List(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	fixedCosts, err := h.listUsecase.Execute(c.Request().Context(), userID, fixedcostusecase.ListFixedCostsInput{
		Month: c.QueryParam("month"),
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.ListFixedCostsResponse{
		Items: toFixedCostDTOs(fixedCosts, h.location),
	})
}

// Update はidとuserIDで対象を特定し、固定費を更新する。
func (h *FixedCostHandler) Update(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	var request dto.UpdateFixedCostRequest
	if bindErr := c.Bind(&request); bindErr != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	updatedFixedCost, err := h.updateUsecase.Execute(c.Request().Context(), userID, fixedcostusecase.UpdateFixedCostInput{
		ID:         c.Param("id"),
		Name:       request.Name,
		Amount:     request.Amount,
		StartMonth: request.StartMonth,
		IsActive:   request.IsActive,
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.FixedCostResponse{
		FixedCost: toFixedCostDTO(updatedFixedCost, h.location),
	})
}

// Delete はidとuserIDで対象を特定し、固定費を削除する。
func (h *FixedCostHandler) Delete(c echo.Context) error {
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
