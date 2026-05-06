package database

import (
	"context"
	"database/sql"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/config"
)

// Open はGORMでPostgreSQLへ接続し、起動時に接続確認まで行う。
func Open(ctx context.Context, cfg config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("get sql database: %w", err)
	}

	applyConnectionPool(sqlDB, cfg)

	if err := sqlDB.PingContext(ctx); err != nil {
		if closeErr := sqlDB.Close(); closeErr != nil {
			return nil, fmt.Errorf("ping database: %w; close database: %w", err, closeErr)
		}

		return nil, fmt.Errorf("ping database: %w", err)
	}

	return db, nil
}

// applyConnectionPool は設定値を標準DB接続プールへ反映する。
func applyConnectionPool(sqlDB *sql.DB, cfg config.Config) {
	sqlDB.SetMaxOpenConns(cfg.DBMaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.DBMaxIdleConns)
	sqlDB.SetConnMaxLifetime(cfg.DBConnMaxLifetime)
}
