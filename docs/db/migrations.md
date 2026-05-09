# DB Migrations

## 方針

DBスキーマはマイグレーションファイルで管理する。

- 手動で本番DBだけに変更を加えない
- テーブル作成、カラム追加、インデックス追加はマイグレーションで管理する
- マイグレーションファイルはバックエンドリポジトリ側で管理する

---

## 配置

```txt
back-end/
  migrations/
    20260505090000_create_users.sql
    20260505091000_create_incomes.sql
    20260505092000_create_fixed_costs.sql
    20260505093000_create_expenses.sql
```

ファイル名は `YYYYMMDDHHMMSS_snake_case.sql` にする。
同じtimestampのmigrationを複数作らない。

---

## Lint / Format

```bash
make db-lint
make db-format
```

SQL migrationはPostgreSQL dialectとしてSQLFluffで検証する。
`*.sql` が存在する状態でSQLFluffが未導入の場合、`make db-lint` は失敗する。

---

## 初期マイグレーション順序

```txt
users
incomes
fixed_costs
expenses
```

---

## 初期マイグレーションに含めるもの

- `pgcrypto` 拡張の有効化
- 4テーブルの作成
- 主キー
- 外部キー
- unique制約
- check制約
- 推奨インデックス

---

## 初期データ

MVPではユーザー登録画面を作らない。

Supabase Auth側でユーザーを事前作成し、初回ログイン時または管理操作で `users` テーブルに紐づくレコードを作成する。

ローカル開発では、実データで画面とAPIを確認するためのseedを `back-end/seeds/local.sql` に置く。

seedは以下を満たす。

- 本番データや個人情報を含めない
- 固定の `DEV_USER_ID` に紐づく
- 再実行しても重複作成されない
- ホーム画面と主要CRUD画面の動作確認に必要な最小データにする
- 仕様外のカテゴリや将来機能のデータを混ぜない

ローカルDBの準備はroot `Makefile` を正とする。

```bash
make dev-setup
```

DBを初期状態から作り直してseedまで入れ直す場合は以下を使う。

```bash
make db-reset
```
