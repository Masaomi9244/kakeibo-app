# Backend Persistence Standards

DTO、model、usecase、repository、GORM、transactionに関する規約です。

---

## DTO / model規約

### domain model

domain modelはアプリ内部の概念を表す。

置いてはいけないもの：

- JSON tag
- GORM tag
- HTTP status
- request / response固有のfield

### request / response DTO

request / response DTOはinterface層に置く。

DTOはHTTP境界の型として扱い、domain modelやGORM modelと混ぜない。

### GORM model

GORM modelはinfrastructure層に置く。

GORM modelをhandlerやusecaseの引数・戻り値に使わない。

### mapper

DTO、domain model、GORM modelの変換は専用関数に分離する。

変換をhandler、usecase、repositoryの長い処理内に埋め込まない。

変換関数は以下のどちらかに置く。

- interface DTOとusecase input / outputの変換: interface層
- domain modelとGORM modelの変換: infrastructure層

---

## usecase規約

### usecaseの形

usecaseは依存するrepository interfaceやtransaction managerをstructに注入する。

```go
type CreateExpenseUsecase struct {
    expenseRepository repository.ExpenseRepository
    txManager         db.TransactionManager
}
```

constructorを用意し、不正なnil依存を作らない。

### input / output

usecaseには専用のinput / output型を定義する。

request DTOをそのままusecase inputとして使わない。

response DTOをusecase outputとして使わない。

### 責務

usecaseは以下に集中する。

- 認証済みuserIDを前提にした処理
- 業務バリデーション
- repository呼び出し
- transaction境界
- 集計計算
- usecase outputの組み立て

### 禁止事項

以下は禁止する。

- Echo contextを受け取る
- HTTP statusを返す
- GORM modelを受け取る
- SQLを書く
- 環境変数を読む
- handler向けJSON field名を意識する
- 複数usecaseの処理を巨大な1usecaseにまとめる

---

## repository規約

### interface

repository interfaceはdomain層に置く。

usecaseが必要な操作だけを定義する。

### 実装

repository実装はinfrastructure層に置く。

GORMやSQLの詳細はrepository実装内に閉じる。

### userID絞り込み

ユーザー所有データを扱うrepository methodは、必ずuserIDを引数に取る。

例：

```go
FindByID(ctx context.Context, userID string, id string) (*model.Expense, error)
Delete(ctx context.Context, userID string, id string) error
```

### 禁止事項

以下は禁止する。

- repository内でHTTP responseを組み立てる
- repository内で業務計算をする
- repository内で認証済みuserIDをcontextから取り出す
- `SELECT *` に依存する
- userIDなしで更新・削除する
- 生SQLを文字列結合で組み立てる
- GORMのエラーを判定不能な形で握りつぶす

---

## GORM / SQL規約

### 基本方針

GORMはinfrastructure層でのみ利用する。

queryはuserID、日付範囲、対象IDなどの条件が明確に読める形にする。

### 日付範囲

月次・日次・年次集計では、Asia/Tokyo基準でstart inclusive / end exclusiveの範囲を作る。

```txt
start <= target < end
```

`DATE(spent_at)` のようにDB側関数へ依存しすぎる実装は原則避ける。indexが効く範囲条件を優先する。

### 更新・削除

更新・削除は対象件数を確認する。

対象が0件の場合はnot foundとして扱う。

### 禁止事項

以下は禁止する。

- 文字列結合でSQLを作る
- user inputをSQL文字列へ直接埋め込む
- 本番処理でdebug SQLを常時出す
- global DB変数へ各層から直接アクセスする
- transaction中に別のDB connectionを勝手に使う

---

## トランザクション規約

### 基本方針

複数のDB操作を一連の処理として扱う場合はtransactionを使う。

transaction境界はusecaseが指定し、実装詳細はinfrastructureに閉じる。

### 必須となる処理

以下は一連の処理として扱う。

- 初回APIアクセス時のusersレコード取得・作成
- users unique制約衝突時の再検索
- 出費登録後に関連する取得が必要な処理

### 注意点

出費登録自体が成功した後にサマリー取得が失敗した場合は、仕様に従い、出費登録は成功として扱う。

このような部分成功を扱う場合は、usecase outputとエラー設計で呼び出し側が判断できるようにする。

### 禁止事項

以下は禁止する。

- handlerでtransactionを直接制御する
- transaction内で不要な外部HTTP通信を行う
- transactionを長時間保持する
- transaction中に別repositoryが通常DB connectionへ逃げる

---
