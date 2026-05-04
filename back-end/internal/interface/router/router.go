package router

import (
	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/handler"
)

// Register は公開endpointとAPI endpointのルーティングを集約する。
func Register(e *echo.Echo) {
	healthHandler := handler.NewHealthHandler()

	e.GET("/health", healthHandler.Get)
}
