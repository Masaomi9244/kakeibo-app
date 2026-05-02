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
    001_create_users.sql
    002_create_incomes.sql
    003_create_fixed_costs.sql
    004_create_expenses.sql
```

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
