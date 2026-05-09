# Backend

Go / Echoを使うバックエンドAPIです。

## 開発

```bash
cp .env.example .env
go mod download
go run ./cmd/api
```

`DATABASE_URL` は起動時に必須です。
ローカルでAPIを起動する前に、PostgreSQLまたはSupabase PostgreSQLへ接続できるURLを `.env` に設定してください。

リポジトリrootからは、Docker PostgreSQL、migration、seedをまとめて準備できます。

```bash
make dev-setup
make api
```

DBだけを操作する場合は、rootから以下を使います。

```bash
make db-migrate
make db-seed
make db-reset
```

`make db-reset` はローカルDBの `public` schemaを作り直すため、開発用DB以外には使わないでください。

起動後は以下でヘルスチェックできます。

```bash
curl -s http://localhost:8080/health
```

## 主なコマンド

```bash
make check
make fmt
make fmt-check
make lint
make test
make test-race
make db-lint
make db-format
```

`make check` はバックエンド変更の完了条件です。
Go formatter、`go mod tidy -diff`、`go vet`、`golangci-lint`、race test、DB migration lintをまとめて実行します。

Goの整形は `golangci-lint fmt` で `gofmt`、`goimports`、`gofumpt`、`gci`
をまとめて適用します。

SQL migrationが追加された場合は `sqlfluff` が必要です。
未導入の状態で `*.sql` が存在すると `make db-lint` は失敗します。

## 参照docs

- `../docs/architecture/back-end.md`
- `../docs/standards/back-end/index.md`
- `../docs/standards/back-end/checklist.md`
