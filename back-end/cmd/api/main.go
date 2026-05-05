package main

import (
	"context"
	"fmt"
	"log"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/config"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/infrastructure/database"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/response"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/router"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	db, err := database.Open(context.Background(), cfg)
	if err != nil {
		log.Fatalf("connect database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("get sql database: %v", err)
	}

	defer func() {
		if err := sqlDB.Close(); err != nil {
			log.Printf("close database: %v", err)
		}
	}()

	e := echo.New()
	e.HideBanner = true
	e.HidePort = true
	e.HTTPErrorHandler = response.HTTPErrorHandler
	e.Use(httpmiddleware.NewCORS(cfg.FrontendOrigin))

	router.Register(e)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", cfg.Port)))
}
