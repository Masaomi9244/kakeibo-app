# Product Overview

## 位置づけ

このドキュメントは、家計簿アプリMVPのプロダクト概要を定義する。

詳細なMVP範囲は `scope.md`、用語は `glossary.md`、決定済み方針と未決事項は `open-questions.md`、実装順序と将来計画は `roadmap.md` を参照する。

---

## アプリ概要

本アプリは、自分だけが利用する個人向け家計管理アプリである。

一般的な家計簿アプリのように細かいカテゴリ分析を目的とするのではなく、「今月あといくら使えるか」を最短で把握することを主目的とする。

出費入力の手間を極力減らし、トップ画面から金額だけをすばやく登録できるようにする。

本アプリの価値は、細かい家計分析ではなく、以下をすぐ把握できることにある。

```txt
今月、自分があといくら使っていいか
```

---

## 最優先仕様

以下はMVP全体で必ず守る。

- 「今月あといくら使えるか」を最短で把握できることを優先する
- 出費登録はトップ画面から金額のみで完了できる
- 出費カテゴリ、収入カテゴリ、予算カテゴリは持たない
- 正となる残額計算と集計はバックエンドで行う
- 表示・集計の基準日はAsia/Tokyoとする
- ログインした本人のデータだけを取得・更新・削除できる
- `user_id` はリクエストから受け取らず、認証済みトークンからバックエンド側で決定する
- DBのIDはDB側でUUIDを生成する

---

## アプリの思想

このアプリでは「何に使ったか」よりも「あといくら使えるか」を重視する。

そのため、出費にはカテゴリを持たせない。

ユーザーが最も頻繁に行う操作は出費入力であるため、トップ画面で金額だけを入力できるようにする。

---

## 認証方針

- Supabase Authを利用する
- 新規登録画面は作らない
- Supabase側でユーザーを事前作成する
- 未ログイン状態ではアプリ画面を表示しない
- 未ログインの場合は `/login` にリダイレクトする
- APIはすべて認証必須とする
- APIでは必ずログインユーザー本人のデータのみ取得・更新・削除する
- `user_id` はリクエストから受け取らず、認証済みトークンからバックエンド側で決定する

---

## 技術スタック概要

### フロントエンド

- Next.js
- TypeScript
- MUI
- TanStack Query
- Atomic Design寄りのコンポーネント設計
- features / usecases / domains を意識した構成

詳細は `../architecture/front-end.md` を参照する。

### バックエンド

- Go
- Echo
- GORM
- PostgreSQL
- Supabase Auth JWT検証
- オニオンアーキテクチャ

詳細は `../architecture/back-end.md` を参照する。

### DB

- PostgreSQL
- Supabase PostgreSQLを想定

詳細は `../architecture/db.md` と `../db/spec.md` を参照する。

### インフラ

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

---

## ルートディレクトリ構成

```txt
kakeibo-app/
  docs/
    README.md
    product/
    features/
    architecture/
    api/
    db/
    standards/
    archive/

  front-end/
    src/

  back-end/
    cmd/
    internal/
    migrations/

  README.md
  .gitignore
```
