package router

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/config"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/infrastructure/persistence"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/handler"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/dateperiod"
	expenseusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/expense"
	monthlysummaryusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/monthlysummary"
)

// Register は公開endpointとAPI endpointのルーティングを集約する。
func Register(e *echo.Echo, db *gorm.DB, cfg config.Config) {
	healthHandler := handler.NewHealthHandler()
	expenseRepository := persistence.NewExpenseRepository(db)
	summaryRepository := persistence.NewMonthlySummaryRepository(db)
	location := dateperiod.AsiaTokyo()

	expenseHandler := handler.NewExpenseHandler(
		expenseusecase.NewCreateExpenseUsecase(
			expenseRepository,
			summaryRepository,
			expenseusecase.NewRealClock(),
			location,
		),
		expenseusecase.NewListExpensesUsecase(expenseRepository, location),
		expenseusecase.NewDeleteExpenseUsecase(expenseRepository),
		location,
	)
	monthlySummaryHandler := handler.NewMonthlySummaryHandler(
		monthlysummaryusecase.NewGetMonthlySummaryUsecase(summaryRepository, location),
	)

	e.GET("/health", healthHandler.Get)

	api := e.Group("/api", httpmiddleware.NewDevelopmentUser(cfg.DevUserID))
	api.POST("/expenses", expenseHandler.Create)
	api.GET("/expenses", expenseHandler.List)
	api.DELETE("/expenses/:id", expenseHandler.Delete)
	api.GET("/monthly-summary", monthlySummaryHandler.Get)
}
