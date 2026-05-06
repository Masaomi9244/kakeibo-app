package main

import (
	"context"
	"fmt"
	"log"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/config"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/infrastructure/database"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/infrastructure/persistence"
	httpmiddleware "github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/middleware"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/response"
	"github.com/Masaomi9244/kakeibo-app/back-end/internal/interface/router"
)

// main はAPIサーバーの起動エントリーポイントを提供する。
func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

// run は設定読み込み、DB接続、middleware、routerを組み立ててAPIサーバーを起動する。
func run() error {
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	db, err := database.Open(context.Background(), cfg)
	if err != nil {
		return fmt.Errorf("connect database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("get sql database: %w", err)
	}

	defer func() {
		if err := sqlDB.Close(); err != nil {
			log.Printf("close database: %v", err)
		}
	}()

	if err := persistence.NewUserRepository(db).EnsureDevelopmentUser(context.Background(), cfg.DevUserID); err != nil {
		return fmt.Errorf("ensure development user: %w", err)
	}

	e := echo.New()
	e.HideBanner = true
	e.HidePort = true
	e.HTTPErrorHandler = response.HTTPErrorHandler
	e.Use(httpmiddleware.NewCORS(cfg.FrontendOrigin))

	router.Register(e, db, cfg)

	return e.Start(fmt.Sprintf(":%s", cfg.Port))
}
