package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
)

// TestHealthHandlerGet はhealth check APIが200 OKと固定responseを返すことを検証する。
func TestHealthHandlerGet(t *testing.T) {
	t.Parallel()

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)

	h := NewHealthHandler()
	if err := h.Get(ctx); err != nil {
		t.Fatalf("HealthHandler.Get() error = %v", err)
	}

	if rec.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", rec.Code, http.StatusOK)
	}

	want := "{\"status\":\"ok\"}\n"
	if rec.Body.String() != want {
		t.Fatalf("body = %q, want %q", rec.Body.String(), want)
	}
}
