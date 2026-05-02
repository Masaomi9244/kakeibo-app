package main

import (
	"fmt"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/config"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/response"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/router"
	"github.com/labstack/echo/v4"
)

func main() {
	cfg := config.Load()

	e := echo.New()
	e.HideBanner = true
	e.HidePort = true
	e.HTTPErrorHandler = response.HTTPErrorHandler
	e.Use(httpmiddleware.NewCORS(cfg.FrontendOrigin))

	router.Register(e)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", cfg.Port)))
}
