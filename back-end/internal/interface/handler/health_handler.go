package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// HealthHandler はhealth check APIのHTTP境界を担当する。
type HealthHandler struct{}

// HealthResponse はhealth check APIのresponse bodyを表す。
type HealthResponse struct {
	Status string `json:"status"`
}

// NewHealthHandler はhealth check API handlerを作成する。
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// Get は認証なしでアプリケーションの稼働状態を確認する。
func (h *HealthHandler) Get(c echo.Context) error {
	return c.JSON(http.StatusOK, HealthResponse{Status: "ok"})
}
