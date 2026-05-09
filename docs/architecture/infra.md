# Infrastructure Architecture

## MVP方針

MVPでは最小構成を優先する。

```txt
Frontend:
  Vercel

Backend:
  Render

Auth:
  Supabase Auth

DB:
  Supabase PostgreSQL
```

AWS構成はMVP完成後に検討する。

MVPでは、AWSを前提にしすぎず、まずは低コストかつ設定が少ない構成で動く状態を優先する。

Backendのデプロイ先はMVPではRenderを正とする。

デプロイ実行直前にRenderの最新プラン、料金、制約を確認する。

---

## CORS

フロントエンドからGo APIを呼び出すため、CORSを設定する。

開発環境ではローカルフロントエンドのURLを許可する。

本番環境ではデプロイ済みフロントエンドURLのみ許可する。

ワイルドカード `*` は使わない。

---

## ローカル開発Runtime

ローカル開発では、実装前にDB、API、Frontendを同じ手順で起動できる状態を用意する。

```txt
Frontend:
  http://localhost:3000

Backend:
  http://localhost:8080

PostgreSQL:
  localhost:5433
```

PostgreSQLのhost portは `5433` を標準とする。

既存の別projectやローカルPostgreSQLが `5432` を使っている場合でも、このprojectの起動確認が止まらないようにするため。

ローカル開発の起動手順はroot `Makefile` を正とする。

```bash
make dev
```

`make dev` は以下を順番に満たす。

1. PostgreSQL containerを起動する
2. PostgreSQLのreadyを待つ
3. migrationを適用する
4. seedを投入する
5. APIを起動する
6. Frontendを起動する

DBだけを準備する場合は以下を使う。

```bash
make dev-setup
```

ローカル開発用seedは、本番データや個人情報を含めない。

ホーム、収入、固定費、カレンダー、年間サマリーの主要画面が空ではなく実データで確認できる最小データだけを入れる。
