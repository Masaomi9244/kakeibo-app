# DB Indexes

## インデックス方針

月次・日次・年次集計では、ほぼすべての検索で `user_id` と日付条件を利用する。

そのため、`user_id + 日付カラム` の複合インデックスを重視する。

---

## users

```txt
users.auth_provider_user_id
users.email
```

---

## incomes

```txt
incomes.user_id
incomes.income_date
incomes.user_id + incomes.income_date
```

---

## fixed_costs

```txt
fixed_costs.user_id
fixed_costs.start_month
fixed_costs.user_id + fixed_costs.start_month
```

---

## expenses

```txt
expenses.user_id
expenses.spent_at
expenses.user_id + expenses.spent_at
```

---

## 推奨インデックスDDL

初期マイグレーションでは最低限以下のインデックスを作成する。

```sql
create unique index users_auth_provider_user_id_unique
  on users (auth_provider_user_id);

create unique index users_email_unique
  on users (email);

create index incomes_user_id_income_date_idx
  on incomes (user_id, income_date);

create index fixed_costs_user_id_start_month_idx
  on fixed_costs (user_id, start_month);

create index expenses_user_id_spent_at_idx
  on expenses (user_id, spent_at);
```
