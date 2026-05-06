package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/annualsummary"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	annualsummaryusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/annualsummary"
)

// AnnualSummaryHandler は年間サマリーAPIのHTTP境界を担当する。
type AnnualSummaryHandler struct {
	getUsecase *annualsummaryusecase.GetAnnualSummaryUsecase
}

// NewAnnualSummaryHandler は年間サマリーAPI handlerを作成する。
func NewAnnualSummaryHandler(getUsecase *annualsummaryusecase.GetAnnualSummaryUsecase) *AnnualSummaryHandler {
	return &AnnualSummaryHandler{getUsecase: getUsecase}
}

// Get はYYYY形式のyear queryで年間サマリーを取得する。
func (h *AnnualSummaryHandler) Get(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	summary, err := h.getUsecase.Execute(c.Request().Context(), userID, c.QueryParam("year"))
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.GetAnnualSummaryResponse{
		AnnualSummary: toAnnualSummaryDTO(summary),
	})
}

func toAnnualSummaryDTO(summary annualsummary.AnnualSummary) dto.AnnualSummary {
	return dto.AnnualSummary{
		Year:             summary.Year,
		TotalIncome:      summary.TotalIncome,
		AvailableIncome:  summary.AvailableIncome,
		ReservedIncome:   summary.ReservedIncome,
		FixedCostTotal:   summary.FixedCostTotal,
		ExpenseTotal:     summary.ExpenseTotal,
		ActualBalance:    summary.ActualBalance,
		AvailableBalance: summary.AvailableBalance,
		Months:           toAnnualMonthSummaryDTOs(summary.Months),
	}
}

func toAnnualMonthSummaryDTOs(months []annualsummary.MonthSummary) []dto.AnnualMonthSummary {
	items := make([]dto.AnnualMonthSummary, 0, len(months))
	for _, month := range months {
		items = append(items, dto.AnnualMonthSummary{
			Month:            month.Month,
			TotalIncome:      month.TotalIncome,
			AvailableIncome:  month.AvailableIncome,
			ReservedIncome:   month.ReservedIncome,
			FixedCostTotal:   month.FixedCostTotal,
			ExpenseTotal:     month.ExpenseTotal,
			ActualBalance:    month.ActualBalance,
			AvailableBalance: month.AvailableBalance,
		})
	}

	return items
}
