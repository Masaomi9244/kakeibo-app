package response

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
)

// ErrorResponse はAPI共通エラーレスポンスの最上位形式を表す。
type ErrorResponse struct {
	Message string        `json:"message"`
	Details []ErrorDetail `json:"details,omitempty"`
}

// ErrorDetail は入力項目ごとのエラー詳細を表す。
type ErrorDetail struct {
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
}

// HTTPErrorHandler は内部エラー詳細を隠し、API共通エラー形式に変換する。
func HTTPErrorHandler(err error, c echo.Context) {
	if c.Response().Committed {
		return
	}

	code := http.StatusInternalServerError
	message := "サーバーでエラーが発生しました"

	var httpErr *echo.HTTPError
	if errors.As(err, &httpErr) {
		code = httpErr.Code
		message = messageForStatus(code)
	}

	if writeErr := c.JSON(code, ErrorResponse{Message: message}); writeErr != nil {
		c.Logger().Error(writeErr)
	}
}

// messageForStatus はHTTP status codeに対応する公開可能な日本語messageを返す。
func messageForStatus(status int) string {
	switch status {
	case http.StatusBadRequest:
		return "入力内容が不正です"
	case http.StatusUnauthorized:
		return "認証が必要です"
	case http.StatusForbidden:
		return "操作する権限がありません"
	case http.StatusNotFound:
		return "対象データが見つかりません"
	default:
		return "サーバーでエラーが発生しました"
	}
}
