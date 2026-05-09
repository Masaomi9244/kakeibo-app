# Frontend Testing Standards

Lint、format、testに関する規約です。

---

## Lint / Format規約

### 基本方針

フロントエンドでは、ESLint、Prettier、TypeScript、テストをすべて通す。

以下が通らない状態で作業完了にしない。

```txt
npm run check
```

`npm run check` は `typecheck`、`lint`、`format`、`test`、`build:check`
をまとめて実行する。

個別確認が必要な場合のみ、以下を実行する。

```txt
npm run typecheck
npm run lint
npm run format
npm run test
npm run build:check
```

パッケージマネージャーがnpm以外の場合でも、同名または同等の一括検証コマンドを用意する。

### ESLintで必ず検出したいもの

ESLintでは最低限以下を検出する。

- hooksルール違反
- 未使用変数
- `any` の安易な使用
- 不要なconsole
- import順の乱れ
- 未解決import
- 循環依存
- 不要な型アサーション
- Promiseの握りつぶし
- floating promise
- 到達不能コード

### 推奨ESLintプラグイン

以下の導入を推奨する。

```txt
@next/eslint-plugin-next
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
eslint-import-resolver-typescript
eslint-plugin-import-x
eslint-plugin-jsx-a11y
eslint-plugin-perfectionist
eslint-plugin-promise
eslint-plugin-react
eslint-plugin-react-hooks
eslint-plugin-sonarjs
eslint-plugin-unused-imports
eslint-plugin-testing-library
eslint-plugin-jest-dom
```

テストランナーにVitestを使う場合は、必要に応じてVitest向けのESLint pluginを導入する。

### TypeScript ESLintの厳しめルール

以下の方針を基本とする。

```txt
no-explicit-any: error
no-floating-promises: error
no-misused-promises: error
no-unnecessary-type-assertion: error
consistent-type-imports: error
no-unused-vars: error
```

### consoleの扱い

`console.log` は禁止する。

一時的なデバッグで使った場合は、完了前に必ず削除する。

本当に必要なログは、用途を明確にしたlogger導入を検討する。

### eslint-disableの扱い

`eslint-disable` は原則禁止する。

どうしても必要な場合は、以下を必ず書く。

- なぜ必要か
- いつ削除できるか
- 代替手段がない理由

例：

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 外部ライブラリの型不備を一時的に吸収するため。型定義追加後に削除する。
```

### Prettier

Prettierでformatを統一する。

手動の好みによる整形差分を出さない。

推奨方針：

```txt
printWidth: 88
singleQuote: false
semi: true
trailingComma: all
endOfLine: lf
```

### import順

import順は機械的にソートする。

原則以下の順とする。

1. 型import
2. Node.js組み込み、外部ライブラリ
3. 内部alias
4. 同階層の相対import
5. CSSなどの副作用import

import順は `eslint-plugin-perfectionist` で自動化する。

### `import type`

型だけを参照するimportは `import type` を使う。

値importと型importを混在させない。

良い例：

```ts
import { createExpense } from "@/features/expense/api/expenseApi";
import type { CreateExpenseRequest } from "@/features/expense/api/expenseDto";
```

悪い例：

```ts
import {
  createExpense,
  CreateExpenseRequest,
} from "@/features/expense/api/expenseApi";
```

### barrel export禁止

`index.ts` などで配下のmoduleをまとめて再exportするbarrel exportは原則禁止する。

import元を明示し、依存関係を追いやすくする。

悪い例：

```ts
export * from "./ExpenseAmountInput";
export * from "./ExpenseList";
```

良い例：

```ts
import { QuickExpenseInput } from "@/components/organisms/QuickExpenseInput/QuickExpenseInput";
```

例外として、外部公開APIを明確に固定したいpackage境界や、ライブラリ都合で必要な場合のみ許可する。

例外を作る場合は、barrel exportを置く理由と公開対象をコメントまたはREADMEに明記する。

### 未使用import

未使用importは残さない。

`eslint-plugin-unused-imports` などで自動削除できるようにする。

### path alias

`src/` からのimportには `@/` aliasを利用する。

深すぎる相対パスは禁止する。

悪い例：

```ts
import { formatAmount } from "../../../libs/money";
```

良い例：

```ts
import { formatAmount } from "@/libs/money";
```

### 型定義ファイルのlint方針

型定義ファイルにもlintを適用する。

未使用型、循環依存、不要なexportを残さない。

型定義ファイルだからといってlint対象外にしない。

### 完了前に必ず確認するコマンド

フロントエンド変更では、完了前に以下を実行する。

```txt
npm run check
```

未実行または失敗した場合は、完了報告に必ず以下を明記する。

- 実行できなかったコマンド
- 失敗理由
- 失敗が今回変更に起因するか
- 残っているリスク

「時間がない」「小さい変更だから」は未実行理由にしない。

### 自動検知したい禁止ルール

設定可能なものは、レビュー任せにせずlintで検知する。

最低限、以下はerrorにする。

```txt
@typescript-eslint/no-explicit-any
@typescript-eslint/no-floating-promises
@typescript-eslint/no-misused-promises
@typescript-eslint/no-unnecessary-type-assertion
@typescript-eslint/consistent-type-imports
@typescript-eslint/no-unused-vars
no-console
react-hooks/rules-of-hooks
react-hooks/exhaustive-deps
unused-imports/no-unused-imports
perfectionist/sort-imports
perfectionist/sort-named-imports
import-x/no-cycle
import-x/no-useless-path-segments
```

## lintで検知できない設計ルールは、この規約のレビュー観点で確認する。

## テスト規約

MVPでは最低限、以下をテストする。

- 金額フォーマット関数
- 日付フォーマット関数
- 出費入力のバリデーション
- 金額正規化処理
- API Clientのエラー処理
- TanStack Queryのquery key生成関数
- Enter保存とblur保存の二重登録防止
- Undo対象が最新1件に置き換わること

テストしやすいように、正規化処理や変換処理はコンポーネントから分離する。

### テスト対象の分離方針

テスト対象は責務ごとに分離する。

1つのテストでUI表示、入力正規化、DTO変換、API通信、TanStack Queryの状態変化をまとめて検証しない。

原則として、以下の単位でテストを分ける。

- formatter / normalizer: 入力値と出力値
- mapper: DTOからdomain型への変換
- usecase: 処理の流れと分岐
- hook: query / mutationの状態とイベント処理
- component: 表示、入力、ユーザー操作
- api client: request生成、response処理、エラー処理

componentテストでは、domain変換やAPI DTOの詳細を直接検証しない。

mapperやusecaseのテストでは、Reactの描画に依存しない。

複数責務をまたぐ統合テストが必要な場合でも、どの責務の連携を確認するテストかを明確にする。

### テスト名

テスト名は、条件と期待結果が分かる日本語または英語で書く。

悪い例：

```ts
it("works", () => {});
it("success", () => {});
```

良い例：

```ts
it("全角数字とカンマを含む金額を整数へ正規化する", () => {});
it("Enter保存後のblurでは出費を二重登録しない", () => {});
```

### テストデータ

テストデータは、仕様上意味のある名前で定義する。

以下は禁止する。

- `data1`、`testData`、`dummy` など意図が分からない名前
- 仕様と関係ないランダム値
- 1つのfixtureを多数のテストで雑に共有する

fixtureを共有する場合は、何の状態を表すfixtureかが名前で分かるようにする。

### UIテストの境界

componentテストでは、ユーザーが見たり操作したりする単位で検証する。

以下は避ける。

- component内部のstate名を直接検証する
- MUIの内部DOM構造に依存する
- API DTOのshapeをcomponentテストで検証する

UIテストでAPI通信が必要な場合は、API関数ではなくhookまたはMSWなどの境界でmockする。

---
