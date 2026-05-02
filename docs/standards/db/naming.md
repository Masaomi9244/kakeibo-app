# DB Naming And Types Standards

DBの命名、型、テーブル設計に関する規約です。

---

## 命名規約

### テーブル名

テーブル名はsnake_caseの複数形にする。

良い例：

```txt
users
incomes
fixed_costs
expenses
```

悪い例：

```txt
user
fixedCost
expense_items
```

MVPでは出費カテゴリを持たないため、`expense_categories` のような仕様外テーブルを追加しない。

### カラム名

カラム名はsnake_caseにする。

良い例：

```txt
auth_provider_user_id
income_date
included_in_balance
start_month
spent_at
created_at
updated_at
```

悪い例：

```txt
userId
incomeDate
isIncludedInBalance
createdAt
```

booleanカラムは意味が明確な名前にする。

良い例：

```txt
included_in_balance
is_active
```

悪い例：

```txt
flag
status
enabled
```

### index名

index名は以下の形式を基本とする。

```txt
{table}_{column_or_columns}_idx
{table}_{column_or_columns}_unique
```

例：

```sql
create index expenses_user_id_spent_at_idx
  on expenses (user_id, spent_at);
```

### constraint名

明示的に名前を付ける場合は、対象と種類が分かる名前にする。

```txt
{table}_{column}_check
{table}_{column}_fkey
{table}_{column}_unique
```

---

## 型規約

### UUID

各テーブルの主キーは以下を基本とする。

```sql
id uuid primary key default gen_random_uuid()
```

初期マイグレーションでは `pgcrypto` を有効化する。

```sql
create extension if not exists "pgcrypto";
```

通常の新規作成では、Go側でUUIDを生成しない。

### 金額

金額はintegerで保存する。

```sql
amount integer not null check (amount > 0)
```

以下は禁止する。

- `numeric` や `decimal` を金額に使う
- 円を小数で保存する
- 0円以下を保存できるschemaにする
- 文字列で金額を保存する

### 日付・時刻

用途ごとに型を分ける。

| 用途 | 型 | 例 |
|---|---|---|
| 収入日 | `date` | `income_date` |
| 固定費の開始月 | `date` | `start_month` |
| 出費日時 | `timestamptz` | `spent_at` |
| 作成日時 | `timestamptz` | `created_at` |
| 更新日時 | `timestamptz` | `updated_at` |

月を表すdateには必ず対象月の1日を保存する。

### 文字列

空文字を許可しない文字列にはcheck制約を付ける。

```sql
check (length(trim(name)) > 0)
```

memoはnullableを許可する。保存する場合は最大255文字を目安とする。

---

## テーブル設計規約

### 共通カラム

主要テーブルは以下を基本とする。

```txt
id
user_id
created_at
updated_at
```

ただし、`users` はアプリ側ユーザーそのものを表すため、`user_id` を持たない。

### users

`users` はSupabase Authのユーザーとアプリ側ユーザーを紐づける。

必須制約：

- `id` はuuid primary key
- `auth_provider_user_id` はnot nullかつunique
- `email` はnot nullかつunique
- `auth_provider_user_id` は空文字不可
- `email` は空文字不可

初回APIアクセスの同時作成に備え、unique制約は必須とする。

### ユーザー所有テーブル

以下は必ず `user_id` を持つ。

- `incomes`
- `fixed_costs`
- `expenses`

`user_id` は `users.id` を参照する。

```sql
foreign key (user_id) references users(id)
```

API側では必ず `user_id` で絞る。DB設計でもuserIDで検索しやすいindexを用意する。

### MVPで持たないもの

MVPでは以下を追加しない。

- 出費カテゴリ
- 収入カテゴリ
- 固定費履歴テーブル
- 論理削除用 `deleted_at`
- 固定費終了月 `end_month`
- 収入種別 `income_type`

追加したくなった場合は、先に仕様を更新する。

---
