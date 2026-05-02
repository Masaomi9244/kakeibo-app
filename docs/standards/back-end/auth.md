# Backend Auth Standards

認証・認可とバリデーションに関する規約です。

---

## 認証・認可規約

### userIDの決定

`userID` は認証済みトークンからバックエンド側で決定する。

以下は禁止する。

- request bodyから `userID` を受け取る
- query parameterから `userID` を受け取る
- URL parameterから `userID` を受け取る
- 開発用固定userIDを本番コードパスに残す

### middleware

認証必須APIではAuth Middlewareを通す。

Auth Middlewareは以下を担当する。

- Authorizationヘッダーの存在確認
- Bearer tokenの取り出し
- Supabase JWT検証
- アプリ側userIDの取得または作成
- Echo contextへのuserID設定

### handler

handlerはcontextからuserIDを取得し、usecase inputへ渡す。

handlerでDB検索して認可判断しない。

### usecase

usecaseは必ずuserIDを受け取り、repository呼び出しにもuserIDを渡す。

### repository

取得、更新、削除は必ずuserIDで絞る。

悪い例：

```sql
DELETE FROM expenses WHERE id = ?
```

良い例：

```sql
DELETE FROM expenses WHERE id = ? AND user_id = ?
```

更新・削除で対象が存在しない場合は、他ユーザー所有か存在しないかを外部へ区別して漏らさない。

---

## バリデーション規約

### 基本方針

フロントエンドの入力値を信用しない。

handlerではrequest形式の構文バリデーションを行い、usecaseでは業務ルールとしてのバリデーションを行う。

### handlerで行うこと

- JSON bind失敗の検知
- required fieldの存在確認
- URL parameterの形式確認
- query parameterの形式確認
- request DTOからusecase inputへの変換

### usecaseで行うこと

- 金額が1以上の整数であること
- 日付、月、年が仕様上許可される範囲であること
- 固定費の開始月が月初日に正規化されること
- includedInBalanceが集計へ正しく反映されること
- 出費登録日時をサーバー側で決定すること

### 共通ルール

以下は必須とする。

- 金額は1以上の整数のみ許可する
- UUIDは正しい形式のみ許可する
- 月指定は `YYYY-MM` 形式のみ許可する
- 日指定は `YYYY-MM-DD` 形式のみ許可する
- 年指定は4桁整数として扱う
- 必須項目は空にしない
- 文字列は前後の空白をtrimして扱う
- memoは保存する場合、最大255文字を目安とする

### 禁止事項

以下は禁止する。

- GORM modelに直接bindする
- request DTOをそのままrepositoryへ渡す
- バリデーション漏れをDB制約だけに任せる
- 不正入力をゼロ値に丸めて保存する
- 日付parse失敗時に現在日時へ置き換える

---
