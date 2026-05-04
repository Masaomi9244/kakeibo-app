# Documentation Guide

このディレクトリは、家計簿アプリの仕様、設計、API、DB、実装規約を管理する場所です。

ドキュメントは「入口を薄く、詳細は役割ごとに分ける」方針で整理します。

---

## 最初に読むもの

実装や仕様確認を始める場合は、以下の順で読みます。

1. `standards/agent-workflow.md`
2. `product/overview.md`
3. `product/scope.md`
4. デザイン実装前は `design/*.md`
5. 該当する `features/*.md`
6. 該当する `api/*.md`
7. 該当する `db/*.md`
8. 該当する `architecture/*.md`
9. 該当する `standards/**/*.md`

現時点では以下を正とします。

1. `product/spec.md`
2. `product/overview.md`
3. `product/scope.md`
4. `product/glossary.md`
5. `product/open-questions.md`
6. `product/roadmap.md`
7. `features/*.md`
8. `design/*.md`
9. `architecture/*.md`
10. `api/*.md`
11. `db/*.md`
12. `front-end/spec.md`
13. `back-end/spec.md`
14. `db/spec.md`
15. `standards/agent-workflow.md`
16. `standards/common.md`
17. `standards/front-end/*.md`
18. `standards/back-end/*.md`
19. `standards/db/*.md`

---

## 決定済みディレクトリ構成

docs配下は、以下の構成を正とします。

```txt
docs/
  README.md

  product/
    overview.md
    scope.md
    glossary.md
    open-questions.md
    roadmap.md

  features/
    auth.md
    home.md
    incomes.md
    fixed-costs.md
    calendar.md
    annual-summary.md
    pwa.md

  design/
    README.md
    figma-make-scope-review.md
    mvp-implementation-spec.md
    component-breakdown.md
    implementation-task-breakdown.md

  architecture/
    overview.md
    front-end.md
    front-end-domain-api-hooks.md
    back-end.md
    db.md
    infra.md

  api/
    common.md
    expenses.md
    incomes.md
    fixed-costs.md
    monthly-summary.md
    expense-calendar.md
    annual-summary.md

  db/
    schema.md
    migrations.md
    indexes.md
    constraints.md
    aggregation.md

  standards/
    agent-workflow.md
    common.md

    front-end/
      index.md
      typescript.md
      react.md
      data-fetching.md
      ui.md
      testing.md
      checklist.md

    back-end/
      index.md
      architecture.md
      go.md
      http.md
      persistence.md
      auth.md
      testing.md
      checklist.md

    db/
      index.md
      naming.md
      migrations.md
      constraints-and-indexes.md
      checklist.md

  archive/
```

---

## 各ディレクトリの責務

### `product/`

プロダクト全体の目的、MVP範囲、用語、決定済み方針、未決事項、ロードマップを置きます。

ここには詳細な画面仕様、API仕様、DB定義、実装規約を書きすぎません。

### `features/`

ユーザー視点の機能仕様を置きます。

画面表示、操作、期待挙動、完了条件を書きます。

API request / response、DB schema、コードの書き方はここに書きません。

### `design/`

Figma Makeなどのデザイン案を、MVP scopeに合わせてレビューし、実装用design specへ落とした内容を置きます。

ここはプロダクト仕様の正ではありません。実装時は `product/` と `features/` を優先し、design specはUI判断の補助として使います。

### `architecture/`

システム全体の構成と設計方針を置きます。

フロントエンド、バックエンド、DB、インフラの関係や責務分担を書きます。

細かい実装規約は `standards/` に置きます。

### `api/`

API契約を置きます。

endpoint、認証要否、request、response、HTTP status、エラー形式を書きます。

バックエンド内部の実装方針やGORMの書き方はここに書きません。

### `db/`

DB仕様を置きます。

schema、migration、index、constraint、aggregationを書きます。

GoやGORMの実装規約は `standards/back-end/persistence.md` に置きます。

### `standards/`

実装規約、チェックリスト、AIエージェント向け作業手順を置きます。

仕様ではなく、「どう実装するか」「どうレビューするか」を書きます。

### `archive/`

旧版、重複、移行済みのドキュメントを退避します。

削除判断がまだ早いものは、いったんここへ移動します。

---

## 互換入口と退避済みファイル

旧来の入口ファイルは、参照元を急に壊さないために互換入口として残します。

| ファイル | 現在の扱い |
|---|---|
| `product/spec.md` | 分割済み。現在はproduct仕様の入口。詳細は `product/overview.md`, `product/scope.md`, `product/glossary.md`, `product/open-questions.md`, `product/roadmap.md` |
| `front-end/spec.md` | 分割済み。現在はfrontend仕様の入口。詳細は `architecture/front-end.md`, `features/*.md`, `api/*.md` |
| `back-end/spec.md` | 分割済み。現在はbackend仕様の入口。詳細は `architecture/back-end.md`, `architecture/infra.md`, `api/*.md`, `db/*.md` |
| `db/spec.md` | 分割済み。現在はDB仕様の入口。詳細は `architecture/db.md`, `db/schema.md`, `db/migrations.md`, `db/indexes.md`, `db/constraints.md`, `db/aggregation.md` |
| `rules/common-coding-standard.md` | 分割済み。互換入口として残す。本文は `standards/common.md` |
| `rules/front-end-coding-standard.md` | 分割済み。互換入口として残す。本文は `standards/front-end/*.md` |
| `rules/back-end-coding-standard.md` | 分割済み。互換入口として残す。本文は `standards/back-end/*.md` |
| `rules/db-coding-standard.md` | 分割済み。互換入口として残す。本文は `standards/db/*.md` |
| `spec.md` | `archive/legacy-spec.md` へ移動済み。新規実装の正ではない |

---

## 更新ルール

- 仕様を変える場合は、まず `product/` または `features/` を更新します。
- API契約を変える場合は、`api/` を更新します。
- DB schemaを変える場合は、`db/` と `standards/db/` を確認します。
- 実装ルールを変える場合は、`standards/` を更新します。
- 仕様と規約が矛盾する場合は、実装前にドキュメントを修正します。
- `archive/` に移動したドキュメントは、新規実装の正として扱いません。

---

## AIエージェント向けルール

AIエージェントは、実装前にこのREADMEと `standards/agent-workflow.md` を入口として読み、該当する仕様・規約へ進みます。

入口ファイルと詳細ファイルの内容が矛盾する場合は、詳細ファイルを優先候補として扱い、実装前にユーザーへ確認します。

ドキュメントを分割する場合は、内容の移動だけを行い、仕様変更を混ぜません。仕様変更が必要な場合は、変更理由を明記します。
