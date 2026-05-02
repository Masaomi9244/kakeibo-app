# DB Standards

DB設計・マイグレーション規約の入口です。詳細は責務別ファイルを参照します。

---

## 目的

この規約は、家計簿アプリのDB設計、マイグレーション、制約、インデックス、日付・タイムゾーン、集計前提を統一するためのルールである。

DBでは、以下を特に重視する。

- アプリコードだけに頼らず、DB制約でもデータの正しさを守る
- 認証済みユーザー本人のデータだけを扱えるschemaにする
- 月次・日次・年次集計でindexが効く形を保つ
- 日付・時刻の扱いをAsia/Tokyo基準で一貫させる
- 手動DB変更ではなく、マイグレーションで履歴管理する
- CodexなどのAIエージェントが迷わずschema変更できる状態にする

---

## 参照する仕様書・規約

DB設計やマイグレーション変更では、以下を必ず参照する。

- `docs/README.md`
- `docs/product/spec.md`
- `docs/product/*.md`
- `docs/architecture/db.md`
- `docs/db/*.md`
- `docs/db/spec.md`
- `docs/back-end/spec.md`
- `docs/standards/common.md`
- `docs/standards/back-end/index.md`
- `docs/standards/db/index.md`

仕様や規約が矛盾する場合は、マイグレーションを作る前に仕様書または規約を修正する。

---

## この規約の読み方

この規約では、実装者とAIエージェントが同じ判断をできるように、以下の意味で用語を使う。

| 表現 | 意味 |
|---|---|
| 必須 | 守らない変更は完了不可 |
| 禁止 | 例外申請なしで使ってはいけない |
| 原則禁止 | 例外申請を同じ変更単位に残した場合のみ許可 |
| 推奨 | 迷った場合は従う。従わない場合は理由を説明できる状態にする |
| 許可 | 使ってよいが、整合性・認可・集計性能を崩してはいけない |

AIエージェントは、曖昧なschema変更を実装で勝手に補完しない。仕様・規約・既存schemaのどれにも根拠がない場合は、先に仕様または規約へ追記してからマイグレーションを作る。

---

## 最優先ルール

以下は必ず守る。

- この規約はDB固有ルールとして `docs/standards/common.md` より優先する
- DB仕様は `docs/db/spec.md` を正とする
- schema変更は必ずマイグレーションで管理する
- 手元DBや本番DBだけを手動変更して完了しない
- 主要テーブルは必ず `user_id` を持つ
- ユーザー所有データは `users.id` への外部キーを持つ
- `id` は `uuid primary key default gen_random_uuid()` を基本とする
- Go側で通常の新規作成IDを生成しない
- 金額はintegerで保存し、1以上をDB制約で保証する
- 作成日時・更新日時は `timestamptz` で保存する
- 月を表すdateは必ず月初日で保存する
- `spent_at` はクライアント時刻ではなくサーバー側で設定する
- 月次・日次・年次検索はstart inclusive / end exclusiveを前提にする
- DBサーバーのtimezone設定へ依存しない
- 認可・整合性に必要なunique制約、foreign key、check制約、indexを省かない
- DBカラム名のsnake_caseをAPI responseへそのまま漏らさない
- 仕様にないカラム、テーブル、enum、カテゴリを追加しない

---

### 実装時の判断順序

DB変更で迷った場合は、必ず以下の順で判断する。

1. `docs/product/spec.md`
2. `docs/db/spec.md`
3. `docs/back-end/spec.md`
4. この規約
5. `docs/standards/back-end/index.md`
6. `docs/standards/common.md`
7. 既存schemaの局所的な慣習

上位の仕様・規約と既存schemaが矛盾する場合は、既存schemaを正としない。修正範囲が大きくなる場合は、移行方針をドキュメントに残す。

### 例外の扱い

禁止・原則禁止ルールへの例外は、以下の条件をすべて満たす場合のみ許可する。

- 例外理由をマイグレーション近接コメントまたはREADMEに明記する
- 代替案を検討したことが分かる
- 削除条件または見直し条件がある
- 影響範囲が1テーブルまたは1集計用途に閉じている

例外コメントの形式は以下に統一する。

```sql
-- exception(db-rule): MVP期間のみ履歴管理を省く。履歴要件追加時に再設計する。
```

認可回避、外部キー不整合、SQL injectionにつながる設計、金額の不正値保存は、例外コメントがあっても禁止する。

---
