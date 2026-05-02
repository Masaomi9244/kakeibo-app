# Backend Architecture

## 技術スタック

- Go
- Echo
- GORM
- PostgreSQL
- Supabase Auth JWT検証
- オニオンアーキテクチャ

---

## 基本方針

バックエンドは、認証、認可、DB操作、集計計算、業務ルールを担当する。

フロントエンドから渡された値を信用せず、必ずAPI側でログインユーザーの確認とバリデーションを行う。

### 担当すること

- Supabase Auth JWTの検証
- アプリ側ユーザーの取得・作成
- APIリクエストのバリデーション
- ログインユーザー本人のデータだけを扱う認可制御
- 出費、収入、固定費のCRUD
- 月次サマリー計算
- カレンダー用の日別集計
- 年間サマリー計算
- DBトランザクション制御
- DBマイグレーション管理
- CORS設定
- APIエラーハンドリング

### 担当しないこと

- 画面表示
- フロントエンドの入力UI制御
- Supabase Authユーザーの新規登録画面提供
- 出費カテゴリ管理
- カテゴリ別分析
- CSVインポート・エクスポート

---

## アーキテクチャ方針

オニオンアーキテクチャを採用する。

依存方向は以下とする。

```txt
interface
  ↓
usecase
  ↓
domain

infrastructure は domain repository interface を実装する
```

### domain

- エンティティ
- リポジトリインターフェース
- ドメインに近い型
- 外部ライブラリに依存しない純粋な定義

### usecase

- アプリケーション固有の処理
- 認可済みユーザーを前提にした登録・更新・削除・集計
- トランザクションが必要な処理の制御
- domain repository interfaceを利用する

### infrastructure

- DB接続
- GORMモデル
- リポジトリ実装
- 外部サービス連携
- Supabase JWT検証に必要な外部通信や鍵取得

### interface

- HTTP handler
- middleware
- router
- request / response DTO

---

## ディレクトリ構成

```txt
back-end/
  cmd/
    api/
      main.go

  internal/
    domain/
    usecase/
    infrastructure/
    interface/

  migrations/
```

---

## 認証・認可

Supabase Authのアクセストークンを利用する。

バックエンドはアクセストークンを検証し、Supabase AuthのユーザーIDを取得する。

API処理では、認証されたユーザーの `user_id` を必ず利用する。

`user_id` はリクエストボディやクエリパラメータから受け取らない。

すべての取得・更新・削除処理は、必ず `user_id` で絞る。

---

## ミドルウェア

認証必須APIではAuth Middlewareを通す。

Auth Middlewareは以下を担当する。

- Authorizationヘッダーの存在確認
- Bearer tokenの取り出し
- Supabase JWT検証
- アプリ側user_idの取得または作成
- Echo contextへのuser_id設定

---

## トランザクション

MVPでは単一テーブルへの登録・更新・削除が中心のため、必要最小限のトランザクションでよい。

ただし、以下は一連の処理として扱う。

- 初回APIアクセス時のusersレコード作成
- 出費登録後にサマリー取得まで行う処理

出費登録自体が成功した後にサマリー取得が失敗した場合は、出費登録は成功として扱う。

---

## バリデーション

フロントエンドの入力値を信用せず、バックエンドでも必ずバリデーションする。

### 共通

- 金額は1以上の整数のみ許可する
- UUIDは正しい形式のみ許可する
- 月指定は `YYYY-MM` 形式のみ許可する
- 日指定は `YYYY-MM-DD` 形式のみ許可する
- 必須項目は空にしない
- 文字列は前後の空白をtrimして扱う
- 任意のmemoは保存する場合、最大255文字を目安とする

---

## ログ

ログには調査に必要な情報を残す。

ログに残すもの：

- APIエラー
- 認証エラー
- DBエラー
- 予期しないpanic

ログに残さないもの：

- access tokenの全文
- パスワード
- 秘密鍵
- 個人情報を過剰に含むデータ

---

## 環境変数

バックエンドでは以下の環境変数を利用する。

```txt
PORT
DATABASE_URL
DB_MAX_OPEN_CONNS
DB_MAX_IDLE_CONNS
DB_CONN_MAX_LIFETIME
SUPABASE_PROJECT_URL
SUPABASE_JWT_ISSUER
SUPABASE_JWT_AUDIENCE
SUPABASE_JWKS_URL
APP_ENV
FRONTEND_ORIGIN
DEV_USER_ID
```

---

## テスト方針

MVPでは最低限、以下をテスト対象とする。

### usecase

- 出費登録のバリデーション
- 収入登録のバリデーション
- 固定費登録のバリデーション
- 月次サマリー計算
- カレンダーの日別残額計算
- 年間サマリー計算
- 固定費の開始月判定
- includedInBalanceの集計反映

### repository

- user_idで絞り込めていること
- 月指定の検索範囲が正しいこと
- 日指定の検索範囲が正しいこと
- `id + user_id` で更新・削除対象を特定できていること
- users同時作成時に二重作成で失敗しないこと

### handler

- 不正な入力で400を返すこと
- 未認証で401を返すこと
- 正常系で期待したJSONを返すこと
- UUID形式でないidに400を返すこと

---

## ローカル開発

認証実装前のローカル開発では、固定の `user_id` を使ってAPI実装を進めてもよい。

Supabase Auth連携後は、アクセストークンから取得したユーザーIDに置き換える。

開発途中で固定 `user_id` を利用する場合は、`DEV_USER_ID` 環境変数で指定する。
