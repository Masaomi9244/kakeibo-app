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

### 依存関係

```bash
cd front-end
npm install
cd ../back-end
go mod download
```

### ローカルDB準備

Docker Desktopを起動したうえで、リポジトリrootから実行します。

```bash
make dev-setup
```

`make dev-setup` は以下を順番に行います。

1. PostgreSQL containerを起動する
2. PostgreSQLの起動完了を待つ
3. `back-end/migrations/` を適用する
4. `back-end/seeds/local.sql` を投入する

DBを初期状態から作り直したい場合は以下を使います。

```bash
make db-reset
```

### アプリ全体を起動

DB準備、API起動、Frontend起動をまとめて行う場合は以下を使います。

```bash
make dev
```

起動後、`http://localhost:3000` を開きます。

### API起動

```bash
make api
```

### Frontend起動

別terminalで実行します。

```bash
make web
```

### MVP横断QA

DB、API、Frontendを起動した状態で、MVP対象画面の実データ横断QAを実行します。

```bash
make qa-mvp
```

`make qa-mvp` は以下を確認します。

1. ホーム、収入、固定費、カレンダー、年間サマリーのrouteが表示できる
2. 収入の登録、更新、削除、`includedInBalance` 切り替えがホームと年間サマリーの集計へ反映される
3. 固定費の登録、更新、削除、`isActive` 切り替えがホーム、カレンダー、年間サマリーの集計へ反映される
4. ホーム相当の出費登録、削除がホーム、カレンダー、年間サマリーの集計へ反映される
5. QA用データを削除した後、関連集計が検証前の値へ戻る

接続先を変える場合は以下の環境変数を指定します。

```bash
API_BASE_URL=http://localhost:8080 FRONTEND_BASE_URL=http://localhost:3000 make qa-mvp
```

### 個別に起動する場合

Frontend:

```bash
cd front-end
npm install
cp .env.example .env.local
npm run dev
```

Backend:

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

| 対象         | URL                            |
| ------------ | ------------------------------ |
| Frontend     | `http://localhost:3000`        |
| Backend      | `http://localhost:8080`        |
| Health Check | `http://localhost:8080/health` |
| PostgreSQL   | `localhost:5433`               |

## ローカル開発コマンド

| コマンド          | 内容                                         |
| ----------------- | -------------------------------------------- |
| `make dev-setup`  | PostgreSQL起動、migration適用、seed投入      |
| `make dev`        | DB準備後、APIとFrontendをまとめて起動        |
| `make db-up`      | PostgreSQL containerを起動                   |
| `make db-migrate` | 未適用migrationを適用                        |
| `make db-seed`    | ローカル開発用seedを投入                     |
| `make db-reset`   | DB schemaを作り直してmigrationとseedを再実行 |
| `make api`        | APIを `http://localhost:8080` で起動         |
| `make web`        | Frontendを `http://localhost:3000` で起動    |
| `make qa-mvp`     | MVP対象画面の実データ横断QA                  |
| `make check`      | backend / frontendの総合チェック             |
