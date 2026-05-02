package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type HealthHandler struct{}

type HealthResponse struct {
	Status string `json:"status"`
}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// Get は認証なしでアプリケーションの稼働状態を確認する。
func (h *HealthHandler) Get(c echo.Context) error {
	return c.JSON(http.StatusOK, HealthResponse{Status: "ok"})
}
