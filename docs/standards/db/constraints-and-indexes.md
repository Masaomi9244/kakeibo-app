# DB Constraints And Indexes Standards

DB制約、index、集計、認可に関する規約です。

---

## 制約規約

### primary key

すべてのテーブルはprimary keyを持つ。

主キーはuuidを基本とする。

### foreign key

ユーザー所有データの `user_id` は `users.id` へのforeign keyを持つ。

MVPではユーザー削除機能を作らないため、cascade deleteは必須にしない。

ユーザー削除機能を追加する場合は、関連データの扱いを再設計してからcascade方針を決める。

### unique

以下はunique制約を必須とする。

- `users.auth_provider_user_id`
- `users.email`

その他のunique制約は、仕様上の一意性が明確な場合のみ追加する。

### check

以下はcheck制約を必須とする。

- 金額は1以上
- 空文字不可の文字列はtrim後の長さが1以上
- 固定費の `start_month` は月初日

`start_month` の月初日制約は、DB checkまたはバックエンドバリデーションのどちらかだけに寄せすぎない。DBでも可能な範囲で守る。

例：

```sql
check (start_month = date_trunc('month', start_month)::date)
```

---

## インデックス規約

### 基本方針

検索条件に合わせてindexを作る。

月次・日次・年次集計では、ほぼすべての検索で `user_id` と日付条件を使うため、複合indexを優先する。

### 必須index

初期マイグレーションでは最低限以下を作成する。

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

### index設計の注意

以下を避ける。

- 単独indexだけを大量に追加する
- 使うqueryがないindexを追加する
- `DATE(spent_at)` 前提の検索でindexを効きにくくする
- index名を自動生成任せにして意図を追いにくくする

indexを追加する場合は、そのindexを使うqueryまたはAPIを説明できる状態にする。

---

## 集計規約

### 正となる集計

以下の正となる集計はバックエンドとDBの組み合わせで行う。

- 月次サマリー
- 日別残額
- 年間サマリー
- 固定費の対象月判定
- includedInBalanceの反映

フロントエンドで正計算しない。

### 月次サマリー

月次サマリーでは、対象月のAsia/Tokyo範囲で収入・出費を集計する。

固定費は対象月が `start_month` 以降、かつ `is_active = true` のものを含める。

### 年間サマリー

年間サマリーでは、対象年のAsia/Tokyo範囲で収入・出費を集計する。

固定費は各月ごとに対象固定費を計算し、年間合計する。

### 禁止事項

以下は禁止する。

- DBサーバーtimezoneに依存した月次集計
- `spent_at` を文字列変換して月判定する
- `user_id` 条件なしで集計する
- fixed_costsの `is_active = false` を計算対象に含める
- `included_in_balance = false` をavailableIncomeに含める

---

## セキュリティ・認可規約

### user_id

ユーザー所有テーブルには必ず `user_id` を持たせる。

APIでは `user_id` で絞るが、DB設計でもその前提を支えるindexとforeign keyを用意する。

### RLS

MVPではGo API側の認証・認可を正とする。

Supabase PostgreSQLのRLSを利用する場合は、Go API側の認可方針と矛盾しないように別途設計する。

RLSを入れる場合は、policyをマイグレーションで管理する。

### 禁止事項

以下は禁止する。

- userIDなしでユーザー所有データを取得・更新・削除する前提のschemaにする
- アプリコードだけで一意性を保証し、DB unique制約を省く
- アプリコードだけで金額の正しさを保証し、DB check制約を省く
- 本番DBへ手動でpolicyやconstraintを追加して終わる

---
