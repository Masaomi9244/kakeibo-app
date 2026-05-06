SHELL := /bin/sh
GOCACHE := $(CURDIR)/.cache/go-build
GOMODCACHE := $(CURDIR)/.cache/go-mod
GOLANGCI_LINT_CACHE := $(CURDIR)/.cache/golangci-lint
GO_ENV := GOCACHE=$(GOCACHE) GOMODCACHE=$(GOMODCACHE) GOLANGCI_LINT_CACHE=$(GOLANGCI_LINT_CACHE)

.PHONY: check db-format db-format-check db-lint doc-check fmt fmt-check lint mod-tidy-check test test-race vet

check: doc-check fmt-check mod-tidy-check vet lint test-race db-lint

doc-check:
	$(GO_ENV) go run ./scripts/check-go-docs.go .

fmt:
	$(GO_ENV) golangci-lint fmt

fmt-check:
	$(GO_ENV) golangci-lint fmt --diff

lint:
	$(GO_ENV) golangci-lint run

mod-tidy-check:
	$(GO_ENV) go mod tidy -diff

test:
	$(GO_ENV) go test ./...

test-race:
	$(GO_ENV) go test -race ./...

vet:
	$(GO_ENV) go vet ./...

db-lint:
	./scripts/check-sql.sh lint

db-format:
	./scripts/check-sql.sh fix

db-format-check:
	./scripts/check-sql.sh format-check
