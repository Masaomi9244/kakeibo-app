# DB Architecture

## 使用DB

PostgreSQLを使用する。

MVPではSupabase PostgreSQLを想定する。

---

## 基本方針

- 金額は整数で保存する
- 通貨は日本円を前提とする
- 出費カテゴリは持たない
- すべての主要テーブルは `user_id` を持つ
- APIでは必ず `user_id` で絞って取得・更新・削除する
- 表示・集計の基準タイムゾーンは Asia/Tokyo とする
- 作成日時・更新日時は `timestamptz` で保存する
- MVPでは削除は物理削除とする
- UUIDはDB側で生成する
- 各テーブルの `id` は `uuid primary key default gen_random_uuid()` とする

---

## テーブル

- users
- incomes
- fixed_costs
- expenses

詳細は `../db/schema.md` を参照する。

---

## 集計

以下の正となる集計はバックエンドとDBの組み合わせで行う。

- 月次サマリー
- 日別残額
- 年間サマリー

詳細は `../db/aggregation.md` を参照する。

---

## マイグレーション

DBスキーマはマイグレーションファイルで管理する。

手動で本番DBだけに変更を加えない。

詳細は `../db/migrations.md` を参照する。
