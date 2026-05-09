SHELL := /bin/sh

BACKEND_DIR := back-end
FRONTEND_DIR := front-end
DATABASE_URL ?= postgres://postgres:postgres@localhost:5433/kakeibo?sslmode=disable
DEV_USER_ID ?= 00000000-0000-0000-0000-000000000001
FRONTEND_ORIGIN ?= http://localhost:3000
NEXT_PUBLIC_API_BASE_URL ?= http://localhost:8080
GOCACHE := $(CURDIR)/$(BACKEND_DIR)/.cache/go-build
GOMODCACHE := $(CURDIR)/$(BACKEND_DIR)/.cache/go-mod
GOLANGCI_LINT_CACHE := $(CURDIR)/$(BACKEND_DIR)/.cache/golangci-lint
GO_ENV := GOCACHE=$(GOCACHE) GOMODCACHE=$(GOMODCACHE) GOLANGCI_LINT_CACHE=$(GOLANGCI_LINT_CACHE)

.PHONY: api check db-down db-migrate db-reset db-seed db-up db-wait dev dev-setup web

dev: dev-setup
	@trap 'kill $$(jobs -p) 2>/dev/null || true' INT TERM EXIT; \
	$(MAKE) api & \
	$(MAKE) web & \
	wait

dev-setup: db-up db-migrate db-seed

db-up:
	docker compose up -d postgres
	$(MAKE) db-wait

db-wait:
	@i=0; \
	while [ $$i -lt 30 ]; do \
		if docker compose exec -T postgres pg_isready -U postgres -d kakeibo >/dev/null 2>&1; then \
			echo "PostgreSQL is ready"; \
			exit 0; \
		fi; \
		i=$$((i + 1)); \
		sleep 1; \
	done; \
	echo "PostgreSQL did not become ready"; \
	exit 1

db-migrate:
	cd $(BACKEND_DIR) && DATABASE_URL="$(DATABASE_URL)" $(GO_ENV) go run ./cmd/devdb migrate

db-seed:
	cd $(BACKEND_DIR) && DATABASE_URL="$(DATABASE_URL)" $(GO_ENV) go run ./cmd/devdb seed

db-reset:
	cd $(BACKEND_DIR) && DATABASE_URL="$(DATABASE_URL)" $(GO_ENV) go run ./cmd/devdb reset

api:
	cd $(BACKEND_DIR) && DATABASE_URL="$(DATABASE_URL)" DEV_USER_ID="$(DEV_USER_ID)" FRONTEND_ORIGIN="$(FRONTEND_ORIGIN)" $(GO_ENV) go run ./cmd/api

web:
	cd $(FRONTEND_DIR) && NEXT_PUBLIC_API_BASE_URL="$(NEXT_PUBLIC_API_BASE_URL)" npm run dev

check:
	$(MAKE) -C $(BACKEND_DIR) check
	cd $(FRONTEND_DIR) && npm run check

db-down:
	docker compose down
