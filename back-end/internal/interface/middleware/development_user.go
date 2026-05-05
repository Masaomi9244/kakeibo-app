package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

const userIDContextKey = "userID"

// NewDevelopmentUser は認証なし実装期間に固定userIDをEcho contextへ設定する。
func NewDevelopmentUser(devUserID string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if devUserID == "" {
				return echo.NewHTTPError(http.StatusInternalServerError)
			}

			c.Set(userIDContextKey, devUserID)

			return next(c)
		}
	}
}

// UserID はmiddlewareがEcho contextへ設定した認可境界用userIDを取り出す。
func UserID(c echo.Context) (string, error) {
	value := c.Get(userIDContextKey)
	userID, ok := value.(string)
	if !ok || userID == "" {
		return "", echo.NewHTTPError(http.StatusUnauthorized)
	}

	return userID, nil
}
