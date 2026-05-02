# DB Migration Standards

DB migration、日付・タイムゾーン、削除、seedに関する規約です。

---

## マイグレーション規約

### 基本方針

DB schemaはマイグレーションファイルで管理する。

手動変更だけで完了しない。

### 配置

マイグレーションは `back-end/migrations/` 配下に置く。

```txt
back-end/
  migrations/
    001_create_users.sql
    002_create_incomes.sql
    003_create_fixed_costs.sql
    004_create_expenses.sql
```

### 順序

初期マイグレーションは依存関係順に作る。

```txt
users
incomes
fixed_costs
expenses
```

foreign keyを持つテーブルは、参照先テーブル作成後に作る。

### 1マイグレーションの責務

1つのマイグレーションには、目的が近い変更だけを入れる。

以下は禁止する。

- 無関係なテーブル変更を1ファイルにまとめる
- schema変更と大量データ補正を理由なく同居させる
- 仕様にない将来用カラムをついでに追加する
- ローカル環境だけで動くSQLを書く

### 既存データがある場合

既存データがあるschema変更では、以下を明確にする。

- 既存データのbackfill方法
- NOT NULL制約を追加する順序
- index作成によるロック影響
- rollbackまたは修正方針

MVP初期段階で既存データがない場合でも、将来の移行を壊す書き方を避ける。

---

## 日付・タイムゾーン規約

### 基本方針

表示・集計の基準タイムゾーンはAsia/Tokyoとする。

DBのローカルタイムゾーンに依存しない。

### 保存ルール

以下を守る。

- `spent_at` は `timestamptz` で保存する
- `created_at` は `timestamptz` で保存する
- `updated_at` は `timestamptz` で保存する
- `income_date` は `date` で保存する
- `start_month` は `date` で保存し、必ず月初日にする

### 検索範囲

月次・日次・年次検索は、バックエンド側でAsia/Tokyo基準のstart / endを作り、DBでは以下の範囲条件で検索する。

```txt
start <= target < end
```

月末日の `23:59:59.999` のような境界には依存しない。

---

## 削除規約

### MVP方針

MVPでは物理削除でよい。

対象：

- `incomes`
- `fixed_costs`
- `expenses`

### 注意点

物理削除すると過去の集計結果も変わる。

MVPではこの挙動を許容する。

削除履歴や復元が必要になった場合は、`deleted_at` を追加する前に以下を再設計する。

- 削除済みレコードを集計対象にする範囲
- 削除済みレコードを一覧へ出す範囲
- 復元時の認可
- index方針

---

## シード・初期データ規約

### 基本方針

MVPではユーザー登録画面を作らない。

Supabase Auth側でユーザーを事前作成し、初回ログイン時または管理操作で `users` に紐づくレコードを作成する。

### 禁止事項

以下は禁止する。

- 本番用個人情報をseedに含める
- 固定の本番userIDをテストデータに使う
- seedで仕様外のカテゴリや種別を作る
- seed実行が既存データを破壊する

---
