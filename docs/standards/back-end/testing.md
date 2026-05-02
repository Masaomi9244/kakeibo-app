# Backend Testing Standards

Lint、format、testに関する規約です。

---

## Lint / Format規約

### 基本方針

バックエンドでは、formatter、lint、testをすべて通す。

完了前に以下を実行する。

```txt
gofmt
goimports
go test ./...
golangci-lint run
```

projectに別コマンドが定義されている場合は、それに従う。

### golangci-lintで検出したいもの

最低限、以下を検出する。

- 未使用変数
- 未使用import
- unchecked error
- ineffectual assignment
- shadowingによる誤読
- context未使用
- cyclomatic complexity過多
- staticcheck相当の問題
- gosec相当の危険な実装

### 完了報告

未実行または失敗した場合は、完了報告に必ず以下を明記する。

- 実行できなかったコマンド
- 失敗理由
- 失敗が今回変更に起因するか
- 残っているリスク

「小さい変更だから」は未実行理由にしない。

---

## テスト規約

### テスト対象

MVPでは最低限、以下をテストする。

- 出費登録のバリデーション
- 収入登録のバリデーション
- 固定費登録のバリデーション
- 月次サマリー計算
- カレンダーの日別残額計算
- 年間サマリー計算
- 固定費の開始月判定
- includedInBalanceの集計反映
- userIDで絞り込めていること
- 月指定の検索範囲が正しいこと
- 日指定の検索範囲が正しいこと
- `id + userID` で更新・削除対象を特定できていること
- users同時作成時に二重作成で失敗しないこと
- 不正な入力で400を返すこと
- 未認証で401を返すこと
- UUID形式でないidに400を返すこと

### テスト分離

テスト対象は責務ごとに分離する。

1つのテストでhandler、usecase、repository、DB、外部JWT検証をまとめて検証しない。

原則として、以下の単位でテストを分ける。

- validator: 入力値とエラー
- usecase: 業務分岐とrepository呼び出し
- repository: DB queryと永続化
- handler: request / responseとHTTP status
- middleware: 認証境界
- integration: 複数層の連携

### テスト名

テスト名は条件と期待結果が分かる日本語または英語で書く。

悪い例：

```go
func TestCreate(t *testing.T) {}
func TestSuccess(t *testing.T) {}
```

良い例：

```go
func TestCreateExpenseRejectsZeroAmount(t *testing.T) {}
func TestDeleteExpenseUsesIDAndUserID(t *testing.T) {}
```

### fixture

fixtureは仕様上意味のある名前で定義する。

以下は禁止する。

- `data1`、`dummy`、`testData` など意図が分からない名前
- 仕様と関係ないランダム値
- 1つのfixtureを多数のテストで雑に共有する
- テストごとに現在日時へ依存する

日時が関わるテストではclockを固定する。

---
