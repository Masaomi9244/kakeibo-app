# Backend

Go / Echoを使うバックエンドAPIです。

## 開発

```bash
cp .env.example .env
go mod download
go run ./cmd/api
```

## 主なコマンド

```bash
go test ./...
go test ./... -race
gofmt -w .
```

## 参照docs

- `../docs/architecture/back-end.md`
- `../docs/standards/back-end/index.md`
- `../docs/standards/back-end/checklist.md`

