package config

import (
	"testing"
	"time"
)

func TestLoad(t *testing.T) {
	t.Setenv("PORT", "9090")
	t.Setenv("APP_ENV", "test")
	t.Setenv("FRONTEND_ORIGIN", "http://localhost:3001")
	t.Setenv("DATABASE_URL", "postgres://user:pass@localhost:5432/kakeibo?sslmode=disable")
	t.Setenv("DB_MAX_OPEN_CONNS", "20")
	t.Setenv("DB_MAX_IDLE_CONNS", "10")
	t.Setenv("DB_CONN_MAX_LIFETIME", "45m")
	t.Setenv("DEV_USER_ID", "00000000-0000-0000-0000-000000000001")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}

	if cfg.Port != "9090" {
		t.Fatalf("Port = %q, want %q", cfg.Port, "9090")
	}

	if cfg.AppEnv != "test" {
		t.Fatalf("AppEnv = %q, want %q", cfg.AppEnv, "test")
	}

	if cfg.FrontendOrigin != "http://localhost:3001" {
		t.Fatalf("FrontendOrigin = %q, want %q", cfg.FrontendOrigin, "http://localhost:3001")
	}

	if cfg.DatabaseURL == "" {
		t.Fatal("DatabaseURL is empty")
	}

	if cfg.DBMaxOpenConns != 20 {
		t.Fatalf("DBMaxOpenConns = %d, want %d", cfg.DBMaxOpenConns, 20)
	}

	if cfg.DBMaxIdleConns != 10 {
		t.Fatalf("DBMaxIdleConns = %d, want %d", cfg.DBMaxIdleConns, 10)
	}

	if cfg.DBConnMaxLifetime != 45*time.Minute {
		t.Fatalf("DBConnMaxLifetime = %s, want %s", cfg.DBConnMaxLifetime, 45*time.Minute)
	}

	if cfg.DevUserID == "" {
		t.Fatal("DevUserID is empty")
	}
}

func TestLoadRequiresDatabaseURL(t *testing.T) {
	t.Setenv("DATABASE_URL", "")

	if _, err := Load(); err == nil {
		t.Fatal("Load() error = nil, want error")
	}
}

func TestLoadRejectsInvalidPoolConfig(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://user:pass@localhost:5432/kakeibo?sslmode=disable")
	t.Setenv("DB_MAX_OPEN_CONNS", "5")
	t.Setenv("DB_MAX_IDLE_CONNS", "6")

	if _, err := Load(); err == nil {
		t.Fatal("Load() error = nil, want error")
	}
}
