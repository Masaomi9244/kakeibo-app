# DB Schema

## テーブル一覧

| テーブル | 概要 |
|---|---|
| users | アプリ側ユーザー |
| incomes | 収入 |
| fixed_costs | 固定費 |
| expenses | 出費 |

---

## users

Supabase Authのユーザーとアプリ側ユーザーを紐づける。

| カラム | 型 | Null | 内容 |
|---|---|---|---|
| id | uuid | false | アプリ内ユーザーID |
| auth_provider_user_id | text | false | Supabase AuthのユーザーID |
| email | text | false | メールアドレス |
| created_at | timestamptz | false | 作成日時 |
| updated_at | timestamptz | false | 更新日時 |

### 制約

- `id` は主キー
- `auth_provider_user_id` はユニーク
- `email` はユニーク
- `auth_provider_user_id` は空文字不可
- `email` は空文字不可

---

## incomes

収入を管理する。

| カラム | 型 | Null | 内容 |
|---|---|---|---|
| id | uuid | false | 収入ID |
| user_id | uuid | false | ユーザーID |
| amount | integer | false | 金額 |
| income_date | date | false | 収入日 |
| memo | text | true | メモ。最大255文字を目安とする |
| included_in_balance | boolean | false | 今月使える金額に含めるか |
| created_at | timestamptz | false | 作成日時 |
| updated_at | timestamptz | false | 更新日時 |

### 制約

- `id` は主キー
- `user_id` は `users.id` を参照する
- `amount` は1以上
- `income_date` は必須
- `included_in_balance` は必須
- `memo` は任意だが、保存する場合は最大255文字を目安とする

---

## fixed_costs

固定費を管理する。

固定費は毎月共通を基本とし、`start_month` 以降の月次計算に反映する。

| カラム | 型 | Null | 内容 |
|---|---|---|---|
| id | uuid | false | 固定費ID |
| user_id | uuid | false | ユーザーID |
| name | text | false | 固定費名 |
| amount | integer | false | 金額 |
| start_month | date | false | 反映開始月 |
| is_active | boolean | false | 有効かどうか |
| created_at | timestamptz | false | 作成日時 |
| updated_at | timestamptz | false | 更新日時 |

### 制約

- `id` は主キー
- `user_id` は `users.id` を参照する
- `name` は空文字不可
- `amount` は1以上
- `start_month` は月初日を保存する
- `is_active` は必須

---

## expenses

出費を管理する。

トップ画面から金額だけで登録することを前提とする。

| カラム | 型 | Null | 内容 |
|---|---|---|---|
| id | uuid | false | 出費ID |
| user_id | uuid | false | ユーザーID |
| amount | integer | false | 金額 |
| spent_at | timestamptz | false | 出費日時 |
| memo | text | true | メモ。最大255文字を目安とする |
| created_at | timestamptz | false | 作成日時 |
| updated_at | timestamptz | false | 更新日時 |

### 制約

- `id` は主キー
- `user_id` は `users.id` を参照する
- `amount` は1以上
- `spent_at` は必須
- `memo` は任意だが、保存する場合は最大255文字を目安とする

### 出費日時

トップ画面から登録した出費は、サーバー側の現在時刻を `spent_at` に保存する。

クライアント側の時刻は信用しない。

---

## 削除方針

MVPでは物理削除でよい。

対象：

- incomes
- fixed_costs
- expenses

物理削除すると、過去の集計結果も変わる。

MVPではシンプルさを優先し、削除後の集計変化は許容する。

---

## 将来追加を検討するカラム

### fixed_costs

```txt
end_month
```

固定費の終了月を管理したくなった場合に追加する。

### expenses

```txt
edited_at
```

出費の編集履歴を扱いたくなった場合に検討する。

### incomes

```txt
income_type
```

給料、ボーナス、臨時収入などを分類したくなった場合に検討する。

MVPではカテゴリや種別を増やしすぎないため、`memo` と `included_in_balance` で対応する。
