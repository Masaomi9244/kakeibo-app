# Backend Standards

バックエンド実装規約の入口です。詳細は責務別ファイルを参照します。

---

## 目的

この規約は、家計簿アプリのバックエンド実装における書き方、設計、責務分離、認証・認可、DBアクセス、エラーハンドリング、lint / formatter / test 方針を統一するためのルールである。

バックエンドでは、以下を特に重視する。

- オニオンアーキテクチャの依存方向を崩さない
- handler、usecase、repository、domainの責務を混ぜない
- 認証済みユーザー本人のデータだけを扱う
- フロントエンドから渡された値を信用しない
- 残額計算、固定費判定、集計処理の正をバックエンドに置く
- DB、外部サービス、HTTPの詳細をdomainやusecaseへ漏らさない
- CodexなどのAIエージェントが迷わず実装できる状態にする

---

## 参照する仕様書・規約

バックエンド実装では、以下を必ず参照する。

- `docs/README.md`
- `docs/product/spec.md`
- `docs/product/*.md`
- `docs/architecture/back-end.md`
- `docs/architecture/infra.md`
- `docs/api/*.md`
- `docs/db/*.md`
- `docs/back-end/spec.md`
- `docs/db/spec.md`
- `docs/standards/common.md`
- `docs/standards/back-end/index.md`
- `docs/standards/db/index.md`

仕様や規約が矛盾する場合は、実装を進める前に仕様書または規約を修正する。

---

## この規約の読み方

この規約では、実装者とAIエージェントが同じ判断をできるように、以下の意味で用語を使う。

| 表現 | 意味 |
|---|---|
| 必須 | 守らない実装は完了不可 |
| 禁止 | 例外申請なしで使ってはいけない |
| 原則禁止 | 例外申請を同じ変更単位に残した場合のみ許可 |
| 推奨 | 迷った場合は従う。従わない場合は理由を説明できる状態にする |
| 許可 | 使ってよいが、責務分離とセキュリティを崩してはいけない |

「必要に応じて」は、以下のいずれかに該当する場合を指す。

- exported function、public method、usecase、handler、middleware、repository、重要なstruct/interfaceである
- 認証、認可、バリデーション、トランザクション、集計、日時変換に関わる
- 関数名や型名だけでは、存在理由または制約が読み取れない
- 将来の実装者が誤って責務を広げやすい

AIエージェントは、曖昧な判断を実装で勝手に補完しない。仕様・規約・既存実装のどれにも根拠がない場合は、先に仕様または規約へ追記してから実装する。

---

## 最優先ルール

以下は必ず守る。

- この規約は `docs/standards/common.md` よりもバックエンド固有ルールとして優先する
- この規約にない共通事項は `docs/standards/common.md` に従う
- 仕様書と規約が矛盾した場合は、実装ではなくドキュメントを先に修正する
- handlerに業務ロジックやDB操作を書かない
- usecaseにHTTP request / response、Echo、GORM modelの詳細を持ち込まない
- repositoryに業務ロジック、認可判断、レスポンス整形を書かない
- domainは外部ライブラリ、DB、HTTP、Echo、GORMに依存しない
- 認証済みユーザーの `user_id` をリクエストボディ、クエリ、URLパラメータから受け取らない
- 取得、更新、削除は必ず `user_id` で絞る
- IDだけで更新・削除しない
- フロントエンドのバリデーションを信用しない
- 入力値はhandlerまたはusecase境界で必ず検証する
- DBエラーやpanicの詳細をAPIレスポンスへそのまま出さない
- access token、password、secret key、service role key、個人情報をログに出さない
- `panic` を通常のエラーハンドリングに使わない
- `context.Background()` をリクエスト処理内で安易に作らない
- `time.Now()` を集計ロジックに直書きしない。必要な場合はclockを注入できる形にする
- Asia/Tokyo基準の月次・日次・年次範囲をDBサーバーのタイムゾーンに依存させない
- gofmt / goimports / lint / test が通らない状態で完了しない
- テスト対象ごとに責務を分け、複数観点を1つのテストに詰め込まない

---

### 実装時の判断順序

実装で迷った場合は、必ず以下の順で判断する。

1. `docs/product/spec.md`
2. `docs/back-end/spec.md`
3. `docs/db/spec.md`
4. この規約
5. `docs/standards/db/index.md`
6. `docs/standards/common.md`
7. 既存実装の局所的な慣習

上位の仕様・規約と既存実装が矛盾する場合は、既存実装を正としない。修正範囲が大きくなる場合は、最小修正で仕様・規約へ寄せる。

### 例外の扱い

禁止・原則禁止ルールへの例外は、以下の条件をすべて満たす場合のみ許可する。

- 例外理由を同じファイルの該当箇所または近接するREADMEに明記する
- 代替案を検討したことが分かる
- 削除条件または見直し条件がある
- 例外の影響範囲が1packageまたは1usecaseに閉じている

例外コメントの形式は以下に統一する。

```go
// exception(backend-rule): 外部ライブラリの制約でこの形にしている。adapter追加後に削除する。
```

認可回避、秘密情報のログ出力、SQL injectionにつながる実装、通常処理でのpanic、他ユーザーデータ操作は、例外コメントがあっても禁止する。

---

## コメント方針

### 基本方針

exportする関数、public method、usecase、handler、middleware、repository、重要なstruct/interfaceには、日本語コメントを書く。

コメントは「コードが何をしているか」ではなく、「何のために存在するか」「どういう意図や制約で使うか」を説明する。

ただし、以下のようなコメントは書かない。

- 関数名、変数名、型名の言い換えだけ
- 実装手順を1行ずつ説明するもの
- 仕様書の全文コピー
- 実装と乖離しやすい細かすぎる説明

小さな非export関数で、名前だけで目的が明確なものはコメント不要とする。

### 良いコメント例

```go
// CreateExpense はログインユーザーの出費を登録し、トップ画面更新用の月次サマリーを返す。
func (u *CreateExpenseUsecase) CreateExpense(ctx context.Context, input CreateExpenseInput) (*CreateExpenseOutput, error) {
    // ...
}
```

```go
// ExpenseRepository はuserIDで認可境界を守りながら出費を永続化する。
type ExpenseRepository interface {
    // ...
}
```

### 悪いコメント例

```go
// Expenseを作成する
func CreateExpense(...) {}
```

```go
// amountを代入する
expense.Amount = amount
```

---
