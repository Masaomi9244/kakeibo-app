package handler

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/Masaomi9244/kakeibo-app/back-end/internal/usecase/apperror"
)

// toHTTPError はusecase errorをHTTP layerのerrorへ変換する。
func toHTTPError(err error) error {
	switch {
	case errors.Is(err, apperror.ErrValidation):
		return echo.NewHTTPError(http.StatusBadRequest)
	case errors.Is(err, apperror.ErrNotFound):
		return echo.NewHTTPError(http.StatusNotFound)
	default:
		return err
	}
}
