package handler

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/domain/expensecalendar"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/dto"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	expensecalendarusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/expensecalendar"
)

// ExpenseCalendarHandler はカレンダーAPIのHTTP境界を担当する。
type ExpenseCalendarHandler struct {
	getUsecase *expensecalendarusecase.GetExpenseCalendarUsecase
	location   *time.Location
}

// NewExpenseCalendarHandler はカレンダーAPI handlerを作成する。
func NewExpenseCalendarHandler(
	getUsecase *expensecalendarusecase.GetExpenseCalendarUsecase,
	location *time.Location,
) *ExpenseCalendarHandler {
	return &ExpenseCalendarHandler{
		getUsecase: getUsecase,
		location:   location,
	}
}

// Get はYYYY-MM形式のmonth queryと任意のdate queryでカレンダー集計を取得する。
func (h *ExpenseCalendarHandler) Get(c echo.Context) error {
	userID, err := httpmiddleware.UserID(c)
	if err != nil {
		return err
	}

	calendar, err := h.getUsecase.Execute(c.Request().Context(), userID, expensecalendarusecase.GetExpenseCalendarInput{
		Month: c.QueryParam("month"),
		Date:  c.QueryParam("date"),
	})
	if err != nil {
		return toHTTPError(err)
	}

	return c.JSON(http.StatusOK, dto.GetExpenseCalendarResponse{
		ExpenseCalendar: h.toExpenseCalendarDTO(calendar),
	})
}

// toExpenseCalendarDTO はカレンダーdomain modelをHTTP response DTOへ変換する。
func (h *ExpenseCalendarHandler) toExpenseCalendarDTO(calendar expensecalendar.ExpenseCalendar) dto.ExpenseCalendar {
	return dto.ExpenseCalendar{
		Month:                calendar.Month,
		AvailableIncome:      calendar.AvailableIncome,
		FixedCostTotal:       calendar.FixedCostTotal,
		ExpenseTotal:         calendar.ExpenseTotal,
		RemainingAmount:      calendar.RemainingAmount,
		Days:                 toExpenseCalendarDayDTOs(calendar.Days),
		SelectedDateExpenses: toExpenseDTOs(calendar.SelectedDateExpenses, h.location),
	}
}

// toExpenseCalendarDayDTOs は日別カレンダーdomain modelのsliceをHTTP response DTOへ変換する。
func toExpenseCalendarDayDTOs(days []expensecalendar.Day) []dto.ExpenseCalendarDay {
	items := make([]dto.ExpenseCalendarDay, 0, len(days))
	for _, day := range days {
		items = append(items, dto.ExpenseCalendarDay{
			Date:            day.Date,
			ExpenseTotal:    day.ExpenseTotal,
			RemainingAmount: day.RemainingAmount,
		})
	}

	return items
}
