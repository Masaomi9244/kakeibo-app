# Kakeibo App

個人向け家計簿アプリのリポジトリです。

仕様、設計、API、DB、実装規約は `docs/` を正とします。

## 構成

```txt
kakeibo-app/
  docs/
  front-end/
  back-end/
```

## 初期セットアップ

### Frontend

```bash
cd front-end
npm install
cp .env.example .env.local
npm run dev
```

### Backend

```bash
cd back-end
cp .env.example .env
go mod download
go run ./cmd/api
```

## 開発時に読むもの

実装前に以下を確認します。

1. `docs/README.md`
2. `docs/standards/agent-workflow.md`
3. 該当する `docs/features/*.md`
4. 該当する `docs/api/*.md`
5. 該当する `docs/db/*.md`
6. 該当する `docs/standards/**/*.md`

## ローカル起動URL

| 対象 | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| Health Check | `http://localhost:8080/health` |

