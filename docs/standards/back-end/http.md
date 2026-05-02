# Backend HTTP Standards

API handler、middleware、CORS、環境変数に関する規約です。

---

## API / handler規約

### handlerの責務

handlerはHTTP境界だけを担当する。

担当すること：

- request bind
- path / query parameter取得
- 構文バリデーション
- userID取得
- usecase input作成
- usecase呼び出し
- usecase errorをHTTP responseへ変換
- response DTO作成

担当しないこと：

- DB query
- GORM model操作
- 業務計算
- transaction制御
- userIDを使った詳細な認可query

### response

JSON responseはcamelCaseにする。

DBカラム名のsnake_caseをそのまま返さない。

成功レスポンス形式は `docs/api/common.md` を正とする。

一覧APIで配列をトップレベルに直接返さない。

### error response

エラー形式は仕様に合わせる。

```json
{
  "message": "入力内容が不正です"
}
```

詳細が必要な場合のみ `details` を付ける。

### 禁止事項

以下は禁止する。

- handlerでGORMをimportする
- handlerでSQLを書く
- handlerで集計計算する
- 内部エラーの詳細をresponseへ出す
- request DTOをusecaseやrepositoryへそのまま渡す

---

## middleware規約

### Auth Middleware

Auth Middlewareは認証必須APIに必ず適用する。

`/health` など明確に公開するendpoint以外は認証必須とする。

### context key

Echo contextに保存するkeyは定数化する。

文字列リテラルを各所に散らさない。

### 禁止事項

以下は禁止する。

- middleware内に各API固有の業務ロジックを書く
- middlewareでrequest bodyを書き換える
- 認証失敗時に詳細なJWT検証エラーをresponseへ出す
- access tokenをログに出す

---

## CORS規約

### 基本方針

CORSは環境ごとに明示的に許可する。

本番環境でワイルドカード `*` を使わない。

### 許可するもの

最低限以下を許可する。

```txt
Headers:
  Authorization
  Content-Type

Methods:
  GET
  POST
  PUT
  DELETE
  OPTIONS
```

### 禁止事項

以下は禁止する。

- 本番で全originを許可する
- 不要なheaderやmethodを広く許可する
- CORSで認可を代替する

---

## 環境変数規約

### 基本方針

環境変数は起動時に読み込み、必須値の不足は起動時に検出する。

処理の途中で環境変数を直接読む実装は禁止する。

### 必須値

バックエンドで利用する環境変数は `docs/back-end/spec.md` に定義されたものを正とする。

例：

```txt
PORT
DATABASE_URL
SUPABASE_JWT_ISSUER
SUPABASE_JWT_AUDIENCE
SUPABASE_JWKS_URL
APP_ENV
FRONTEND_ORIGIN
```

### 禁止事項

以下は禁止する。

- DB接続情報をコードに直書きする
- 本番秘密情報をtest fixtureへ置く
- 未設定時に空文字で処理を続ける
- `APP_ENV` だけで認可を緩める

---

## ログ規約

### ログに残すもの

以下は調査に必要な範囲でログに残す。

- APIエラー
- 認証エラー
- DBエラー
- 予期しないpanic
- requestID
- endpoint
- HTTP method

### ログに残さないもの

以下は禁止する。

- access tokenの全文
- password
- secret key
- service role key
- Authorization header
- 個人情報を過剰に含むrequest / response

### 方針

ログは調査用であり、ユーザー向けmessageとは分ける。

同じエラーを複数層で重複ログ出力しない。ログ出力責務を持つ層を決める。

---
