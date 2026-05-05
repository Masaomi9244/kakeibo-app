package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	monthlysummaryusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/monthlysummary"
)

// MonthlySummaryHandler は月次サマリーAPIのHTTP境界を担当する。
type MonthlySummaryHandler struct {
	getUsecase *monthlysummaryusecase.GetMonthlySummaryUsecase
}

// NewMonthlySummaryHandler は月次サマリーAPI handlerを作成する。
func NewMonthlySummaryHandler(getUsecase *monthlysummaryusecase.GetMonthlySummaryUsecase) *MonthlySummaryHandler {
	return &MonthlySummaryHandler{getUsecase: getUsecase}
}

// Get はYYYY-MM形式のmonth queryで月次サマリーを取得する。
func (h *MonthlySummaryHandler) Get(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	summary, err := h.getUsecase.Execute(c.Request().Context(), userID, c.QueryParam("month"))
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.GetMonthlySummaryResponse{
		MonthlySummary: toMonthlySummaryDTO(summary),
	})
}
