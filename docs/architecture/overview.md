# Architecture Overview

## 全体方針

家計簿アプリは、フロントエンド、バックエンド、DB、Authを分離する。

正となる業務ロジックと集計はバックエンドで行い、フロントエンドは画面表示、入力、API呼び出し、最低限の入力補助を担当する。

---

## 構成

```txt
Frontend:
  Next.js / TypeScript / MUI / TanStack Query

Backend:
  Go / Echo / GORM

Auth:
  Supabase Auth

DB:
  Supabase PostgreSQL
```

---

## 責務分担

| 領域 | 主な責務 |
|---|---|
| Frontend | 画面表示、ユーザー入力、API呼び出し、ログイン状態管理 |
| Backend | 認証、認可、DB操作、集計計算、業務ルール |
| DB | schema、制約、index、永続化 |
| Auth | Supabase Authによるユーザー認証 |

---

## 参照

- `front-end.md`
- `back-end.md`
- `db.md`
- `infra.md`
