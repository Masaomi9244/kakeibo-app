package apperror

import "errors"

var (
	// ErrValidation は入力値が仕様を満たさないことを表す。
	ErrValidation = errors.New("validation error")
	// ErrNotFound は指定されたリソースが存在しないことを表す。
	ErrNotFound = errors.New("not found")
)
