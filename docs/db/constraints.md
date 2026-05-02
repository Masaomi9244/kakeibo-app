# DB Constraints

## UUID

UUIDはDB側で生成する。

各テーブルの `id` は以下を基本とする。

```sql
id uuid primary key default gen_random_uuid()
```

PostgreSQLで `gen_random_uuid()` を利用するため、初期マイグレーションで `pgcrypto` 拡張を有効化する。

```sql
create extension if not exists "pgcrypto";
```

---

## check制約

金額はDB側でも1以上を保証する。

```sql
amount integer not null check (amount > 0)
```

`fixed_costs.name` は空文字を保存しない。

```sql
check (length(trim(name)) > 0)
```

`fixed_costs.start_month` は月初日を保存する。

```sql
check (start_month = date_trunc('month', start_month)::date)
```

---

## 外部キー

`incomes.user_id`, `fixed_costs.user_id`, `expenses.user_id` は `users.id` を参照する。

```sql
foreign key (user_id) references users(id)
```

MVPでは、ユーザー削除機能を作らないため、ユーザー削除時のcascadeは重要ではない。

ただし、将来的な整合性を考え、外部キー制約は付与する。

ユーザー削除機能を追加する場合は、関連データをどう扱うかを再設計する。

---

## バリデーション方針

DB制約だけに頼らず、バックエンドでもバリデーションを行う。

### 共通

- 金額は1以上
- UUIDは正しい形式
- 必須項目は空にしない

### incomes

- `income_date` は必須
- `included_in_balance` は必須

### fixed_costs

- `name` は空文字不可
- `start_month` は月初日
- `is_active` は必須

### expenses

- `amount` は1以上
- `spent_at` はサーバー側で設定する
