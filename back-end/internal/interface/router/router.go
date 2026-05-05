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
	fixedcostusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/fixedcost"
	incomeusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/income"
	monthlysummaryusecase "github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/monthlysummary"
)

// Register は公開endpointとAPI endpointのルーティングを集約する。
func Register(e *echo.Echo, db *gorm.DB, cfg config.Config) {
	healthHandler := handler.NewHealthHandler()
	incomeRepository := persistence.NewIncomeRepository(db)
	fixedCostRepository := persistence.NewFixedCostRepository(db)
	expenseRepository := persistence.NewExpenseRepository(db)
	summaryRepository := persistence.NewMonthlySummaryRepository(db)
	location := dateperiod.AsiaTokyo()

	incomeHandler := handler.NewIncomeHandler(
		incomeusecase.NewCreateIncomeUsecase(incomeRepository, location),
		incomeusecase.NewListIncomesUsecase(incomeRepository, location),
		incomeusecase.NewUpdateIncomeUsecase(incomeRepository, location),
		incomeusecase.NewDeleteIncomeUsecase(incomeRepository),
		location,
	)
	fixedCostHandler := handler.NewFixedCostHandler(
		fixedcostusecase.NewCreateFixedCostUsecase(fixedCostRepository, location),
		fixedcostusecase.NewListFixedCostsUsecase(fixedCostRepository, location),
		fixedcostusecase.NewUpdateFixedCostUsecase(fixedCostRepository, location),
		fixedcostusecase.NewDeleteFixedCostUsecase(fixedCostRepository),
		location,
	)
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
	api.POST("/incomes", incomeHandler.Create)
	api.GET("/incomes", incomeHandler.List)
	api.PUT("/incomes/:id", incomeHandler.Update)
	api.DELETE("/incomes/:id", incomeHandler.Delete)
	api.POST("/fixed-costs", fixedCostHandler.Create)
	api.GET("/fixed-costs", fixedCostHandler.List)
	api.PUT("/fixed-costs/:id", fixedCostHandler.Update)
	api.DELETE("/fixed-costs/:id", fixedCostHandler.Delete)
	api.POST("/expenses", expenseHandler.Create)
	api.GET("/expenses", expenseHandler.List)
	api.DELETE("/expenses/:id", expenseHandler.Delete)
	api.GET("/monthly-summary", monthlySummaryHandler.Get)
}
