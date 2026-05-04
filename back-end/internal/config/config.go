package config

import "os"

type Config struct {
	Port           string
	AppEnv         string
	FrontendOrigin string
}

// Load はローカル開発とデプロイ環境で共通利用する環境変数を読み込む。
func Load() Config {
	return Config{
		Port:           getEnv("PORT", "8080"),
		AppEnv:         getEnv("APP_ENV", "development"),
		FrontendOrigin: getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
