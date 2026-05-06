# Backend Go Standards

Goの基本、context、error handlingに関する規約です。

---

## Go基本規約

### formatter

Goコードは必ず `gofmt` と `goimports` を通す。

手動の好みによる整形差分を出さない。

このリポジトリでは `golangci-lint fmt` を正とする。
`gofmt`、`goimports`、`gofumpt`、`gci` の差分は `make fmt` で直し、`make fmt-check` で検出する。

完了前には個別コマンドではなく、原則として `make check` を実行する。

### package名

package名は短い小文字にする。

良い例：

```txt
expense
income
fixedcost
monthlysummary
expensecalendar
annualsummary
```

悪い例：

```txt
expenseUsecase
fixed_cost
handlers
utils
common
```

`utils`、`common`、`helper` は原則禁止する。責務を表すpackage名にする。

### ファイル名

Goのファイル名はsnake_caseにする。

良い例：

```txt
create_expense.go
get_monthly_summary.go
auth_middleware.go
```

### struct / interface / 関数名

名前は役割が分かるように具体的にする。

避ける名前：

```txt
Data
Info
Result
Manager
Processor
HandlerFunc
Do
Run
Process
```

短いスコープの変数を除き、`data`、`result`、`tmp` のような名前を使わない。

### exported / unexported

外部packageから使う必要がないものはexportしない。

exportする場合は、以下を満たす。

- コメントを書く
- 利用責務が明確である
- package境界として公開してよい

### コメント規約

フロントエンドのTSDoc方針と同じく、バックエンドではすべての関数、method、type、interfaceにGoDocコメントを書く。

対象はexported / unexportedを問わない。
この規約は `make doc-check` で機械検証し、`make check` に含める。

GoDocは以下を満たす。

- コメントは対象識別子名から始める
- 「何のために存在するか」「どの層の責務か」を説明する
- 単なる実装手順や識別子名の言い換えを書かない
- handler、usecase、repository、mapper、DTO、domain型は層の境界が分かるように書く

良い例：

```go
// CreateIncomeUsecase は対象ユーザーの収入登録ルールを実行する。
type CreateIncomeUsecase struct {
    repository income.Repository
}

// Execute は入力値を検証し、対象ユーザーの収入を登録する。
func (u *CreateIncomeUsecase) Execute(ctx context.Context, userID string, input CreateIncomeInput) (income.Income, error) {
    // ...
}
```

private helperでもコメントを省略しない。

```go
// normalizeMemo は空白だけのmemoを未指定として扱い、最大文字数を検証する。
func normalizeMemo(value *string) (normalizedMemo, error) {
    // ...
}
```

悪い例：

```go
// memoをtrimする。
func normalizeMemo(value *string) (normalizedMemo, error) {
    // ...
}
```

### 責務分離規約

フロントエンドで見た目やhelperを切り出すのと同じく、バックエンドでは層の責務を混ぜない。

各層の責務は以下に固定する。

- `cmd`: 起動、設定読み込み、依存関係の組み立てだけを行う
- `interface/handler`: HTTP request / response、query、path、status code、DTO変換だけを扱う
- `usecase`: 入力検証、業務フロー、repository呼び出し順だけを扱う
- `domain`: 業務上の型、入力、repository interfaceだけを扱う
- `infrastructure/persistence`: GORM model、SQL query、DB error wrapだけを扱う
- `infrastructure/database`: DB接続とconnection pool設定だけを扱う

以下は禁止する。

- handlerでGORMやSQLを直接呼ぶ
- repositoryでHTTP statusやDTOを扱う
- domain packageがEcho、GORM、環境変数に依存する
- usecaseがEchoの `Context` やHTTP status codeを返す
- mapper、normalize、date変換などのprivate helperを責務と違うpackageへ置く

helperは「利用される層」に置く。
複数層から使いたくなった場合だけ、責務名を持つpackageとして切り出す。
`common`、`utils`、`helper` への退避は禁止する。

1ファイルに複数の主要責務を置かない。
handler、usecase、repository、mapper、model、config、middlewareは、変更理由が分かれる時点で別fileまたは別packageへ分ける。

### ポインタと値

structをポインタで扱うか値で扱うかは、以下で判断する。

- mutationするもの、サイズが大きいもの、nilで存在しない状態を表すものはポインタを許可する
- 値オブジェクト、入力DTO、小さな不変値は値を優先する
- nilが意味を持たない場合にポインタで返さない

戻り値でnilを使う場合は、nilの意味を呼び出し側が明確に扱える設計にする。

---

## context規約

### 基本方針

リクエストスコープの処理は `context.Context` を必ず受け取る。

関数シグネチャでは `ctx context.Context` を第一引数にする。

```go
func (u *CreateExpenseUsecase) Execute(ctx context.Context, input CreateExpenseInput) (*CreateExpenseOutput, error) {
    // ...
}
```

### 禁止事項

以下は禁止する。

- request処理中に `context.Background()` を新規作成して下位層へ渡す
- `context.TODO()` を実装完了コードに残す
- contextに大量の業務データを詰め込む
- contextをstruct fieldとして保持する

contextに入れてよいものは、request scopedな値に限定する。

例：

- userID
- requestID
- loggerに紐づくtrace情報

---

## エラーハンドリング規約

### 基本方針

エラーは握りつぶさない。

下位層のエラーは、呼び出し元が判断できる形でwrapする。

```go
return nil, fmt.Errorf("create expense: %w", err)
```

### sentinel error

認可、未検出、バリデーションなど、上位層でHTTP statusへ変換する必要があるものは、判定可能なerrorにする。

例：

```go
var ErrNotFound = errors.New("not found")
var ErrUnauthorized = errors.New("unauthorized")
var ErrForbidden = errors.New("forbidden")
var ErrValidation = errors.New("validation error")
```

`errors.Is` / `errors.As` で判定できる形を優先する。

### handlerでの変換

HTTP statusへの変換はinterface層で行う。

usecase内でHTTP status codeを返さない。

### 禁止事項

以下は禁止する。

- 通常の入力エラーやDBエラーでpanicする
- `err != nil` を無視する
- エラーをログに出してnilを返す
- DBエラーの全文をAPIレスポンスに出す
- 外部サービスエラーの詳細をユーザー向けmessageにそのまま出す

---

## 日付・タイムゾーン規約

### 基本方針

表示・集計の基準タイムゾーンはAsia/Tokyoとする。

DBのローカルタイムゾーンに依存しない。

### 実装ルール

以下を守る。

- 月指定 `YYYY-MM` はAsia/Tokyoの月初startと翌月月初endへ変換する
- 日指定 `YYYY-MM-DD` はAsia/Tokyoの当日startと翌日startへ変換する
- 年指定はAsia/Tokyoの年初startと翌年年初endへ変換する
- DB検索はstart inclusive / end exclusiveにする
- `spent_at` はサーバー側で設定する
- テストではclockを固定できるようにする

### 禁止事項

以下は禁止する。

- 集計処理で `time.Now()` を直接呼ぶ
- parse失敗時に現在日時へ置き換える
- DBサーバーのtimezone設定を前提にする
- 月末日の23:59:59.999のような境界に依存する

---
