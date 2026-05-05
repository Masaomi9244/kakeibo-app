package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config はバックエンド起動時に確定させる環境設定を表す。
type Config struct {
	Port                string
	AppEnv              string
	FrontendOrigin      string
	DatabaseURL         string
	SupabaseProjectURL  string
	SupabaseJWTIssuer   string
	SupabaseJWTAudience string
	SupabaseJWKSURL     string
	DevUserID           string
	DBConnMaxLifetime   time.Duration
	DBMaxOpenConns      int
	DBMaxIdleConns      int
}

// Load はローカル開発とデプロイ環境で共通利用する環境変数を読み込む。
func Load() (Config, error) {
	if err := loadEnvFile(); err != nil {
		return Config{}, err
	}

	cfg := Config{
		Port:                getEnv("PORT", "8080"),
		AppEnv:              getEnv("APP_ENV", "development"),
		FrontendOrigin:      getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
		DatabaseURL:         os.Getenv("DATABASE_URL"),
		SupabaseProjectURL:  os.Getenv("SUPABASE_PROJECT_URL"),
		SupabaseJWTIssuer:   os.Getenv("SUPABASE_JWT_ISSUER"),
		SupabaseJWTAudience: os.Getenv("SUPABASE_JWT_AUDIENCE"),
		SupabaseJWKSURL:     os.Getenv("SUPABASE_JWKS_URL"),
		DevUserID:           os.Getenv("DEV_USER_ID"),
		DBConnMaxLifetime:   30 * time.Minute,
		DBMaxOpenConns:      10,
		DBMaxIdleConns:      5,
	}

	if err := applyPoolConfig(&cfg); err != nil {
		return Config{}, err
	}

	if err := validate(cfg); err != nil {
		return Config{}, err
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

func loadEnvFile() error {
	for _, filename := range []string{".env", "back-end/.env"} {
		if err := godotenv.Load(filename); err != nil {
			if errors.Is(err, os.ErrNotExist) {
				continue
			}

			return fmt.Errorf("load %s: %w", filename, err)
		}
	}

	return nil
}

func applyPoolConfig(cfg *Config) error {
	maxOpenConns, err := getEnvInt("DB_MAX_OPEN_CONNS", cfg.DBMaxOpenConns)
	if err != nil {
		return err
	}

	maxIdleConns, err := getEnvInt("DB_MAX_IDLE_CONNS", cfg.DBMaxIdleConns)
	if err != nil {
		return err
	}

	connMaxLifetime, err := getEnvDuration("DB_CONN_MAX_LIFETIME", cfg.DBConnMaxLifetime)
	if err != nil {
		return err
	}

	cfg.DBMaxOpenConns = maxOpenConns
	cfg.DBMaxIdleConns = maxIdleConns
	cfg.DBConnMaxLifetime = connMaxLifetime

	return nil
}

func getEnvInt(key string, fallback int) (int, error) {
	value := os.Getenv(key)
	if value == "" {
		return fallback, nil
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("parse %s: %w", key, err)
	}

	return parsed, nil
}

func getEnvDuration(key string, fallback time.Duration) (time.Duration, error) {
	value := os.Getenv(key)
	if value == "" {
		return fallback, nil
	}

	parsed, err := time.ParseDuration(value)
	if err != nil {
		return 0, fmt.Errorf("parse %s: %w", key, err)
	}

	return parsed, nil
}

func validate(cfg Config) error {
	if cfg.DatabaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}

	if cfg.FrontendOrigin == "" {
		return errors.New("FRONTEND_ORIGIN is required")
	}

	if cfg.DevUserID == "" {
		return errors.New("DEV_USER_ID is required")
	}

	if cfg.DBMaxOpenConns <= 0 {
		return errors.New("DB_MAX_OPEN_CONNS must be greater than 0")
	}

	if cfg.DBMaxIdleConns < 0 {
		return errors.New("DB_MAX_IDLE_CONNS must be 0 or greater")
	}

	if cfg.DBMaxIdleConns > cfg.DBMaxOpenConns {
		return errors.New("DB_MAX_IDLE_CONNS must be less than or equal to DB_MAX_OPEN_CONNS")
	}

	if cfg.DBConnMaxLifetime <= 0 {
		return errors.New("DB_CONN_MAX_LIFETIME must be greater than 0")
	}

	return nil
}
