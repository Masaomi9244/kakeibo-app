# DB Checklist

DB変更前後の確認項目です。

---

## テスト・検証規約

### 必須確認

DB変更後は、最低限以下を確認する。

- マイグレーションが空DBに適用できる
- `pgcrypto` が有効化され、UUIDがDB側で生成される
- foreign keyが期待通り効く
- unique制約が期待通り効く
- check制約が期待通り効く
- 必須indexが存在する
- userIDと日付範囲のqueryでindexを使える形になっている
- バックエンドのrepositoryテストが通る
- SQL migrationが `make db-lint` を通る
- migrationファイル名が `YYYYMMDDHHMMSS_snake_case.sql` になっている
- migration先頭に目的コメントがある
- テーブル作成・変更時に `COMMENT ON TABLE` と `COMMENT ON COLUMN` が追加されている
- 制約・indexの意図がコメントまたは命名から読み取れる

### テストデータ

テストデータは仕様上意味のある名前にする。

以下は禁止する。

- `test1`、`dummy`、`sample` だけの意図が分からないデータ
- timezoneに依存して結果が変わるデータ
- userID混在の認可テストがない状態でrepositoryを完了する

---

## 禁止事項

以下は禁止する。

- 仕様にないテーブル、カラム、カテゴリ、enumを追加する
- 本番DBや手元DBだけを手動変更して完了する
- userIDを持つべきテーブルから `user_id` を省く
- ユーザー所有データにforeign keyを付けない
- IDをGo側で通常生成する
- 金額を文字列、小数、nullableで保存する
- 0円以下の金額を保存できる
- `start_month` に月初日以外を保存できる
- DBサーバーtimezoneに依存する集計設計にする
- indexが効かない日付文字列変換を前提にする
- unique制約やcheck制約をアプリコードだけで代替する
- migrationに仕様外の将来用カラムを混ぜる
- seedに本番個人情報を入れる

---

## レビュー観点

DB変更レビューでは以下を確認する。

- `docs/db/spec.md` と矛盾していないか
- 仕様にないテーブルやカラムを追加していないか
- テーブル名、カラム名、index名が規約通りか
- UUIDがDB側で生成されるか
- 金額がintegerかつ1以上で制約されているか
- ユーザー所有テーブルが `user_id` を持つか
- `user_id` にforeign keyと検索用indexがあるか
- `users.auth_provider_user_id` と `users.email` がuniqueか
- 月次・日次・年次検索でindexが効く形か
- `spent_at`、`created_at`、`updated_at` が `timestamptz` か
- `start_month` がdateかつ月初日を保証しているか
- 物理削除による集計変化が仕様と一致しているか
- migrationが依存順に並んでいるか
- migrationがSQLFluffでlint / formatされているか
- 既存データがある場合の移行手順が考慮されているか
- RLSやpolicyを追加する場合、マイグレーションで管理されているか
- backend repositoryの認可テストと矛盾しないか

---

## AIエージェント向け作業手順

AIエージェントがDBを変更する場合は、以下の順で作業する。

1. `docs/standards/agent-workflow.md`、関連する仕様書、この規約を読む
2. 既存schemaとマイグレーションを探す
3. 変更対象が仕様に存在するか確認する
4. テーブル、カラム、制約、index、migration順序を先に決める
5. バックエンドのdomain model、GORM model、repositoryへの影響を確認する
6. マイグレーションを作成する
7. 必要なバックエンド実装とテストを更新する
8. `make db-lint`、マイグレーション適用、repository test、backend testを確認する
9. 未実行または失敗があれば、理由と残リスクを報告する

AIエージェントは以下をしてはいけない。

- 仕様にないschemaを雰囲気で追加する
- migrationを作らずDB変更だけを説明する
- 制約やindexを後回しにする
- userID認可への影響を確認せずにテーブルを追加する
- 失敗した検証コマンドを隠して完了扱いにする

---

## 変更前チェックリスト

DB変更前に以下を確認する。

- 変更対象が仕様書に存在する
- schema変更がMVP範囲内である
- テーブル名・カラム名が命名規約に合っている
- 必要なprimary key、foreign key、unique、check制約が決まっている
- 必要なindexが決まっている
- `user_id` が必要なテーブルか判断している
- 日付・時刻の型とtimezone方針が決まっている
- 既存データがある場合の移行手順が決まっている
- バックエンド実装への影響が分かっている

---

## 完了条件

DB変更は、以下を満たした場合のみ完了とする。

- 仕様書または規約と矛盾していない
- migrationが作成されている
- primary key、foreign key、unique、check制約が必要範囲で設定されている
- ユーザー所有テーブルが `user_id` を持つ
- `user_id` と日付条件に必要なindexがある
- UUIDがDB側で生成される
- 金額がintegerかつ1以上で保存される
- 日付・時刻型が用途に合っている
- 月次・日次・年次集計がAsia/Tokyo基準で実装しやすいschemaになっている
- バックエンドのrepository / GORM model / domain modelとの整合性がある
- 必要なテストまたは検証結果を確認している
- `make db-lint` が成功している

---

## 例外申請テンプレート

禁止または原則禁止ルールの例外を作る場合は、以下をマイグレーション近接コメントまたはREADMEに残す。

```md
### db-rule exception

- 対象ルール:
- 例外が必要な理由:
- 検討した代替案:
- 影響範囲:
- 削除または見直し条件:
```

例外は恒久化しない。削除条件が書けない例外は、設計を見直す。
