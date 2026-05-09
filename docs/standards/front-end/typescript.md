# Frontend TypeScript Standards

TypeScriptと型定義に関するフロントエンド規約です。

---

## TypeScript規約

### strict

TypeScriptはstrictを有効にする。

`tsconfig.json` では最低限以下を有効にする。

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

`strict` を弱める設定は禁止する。既存コード対応で一時的に弱める場合でも、対象範囲、理由、戻す条件をドキュメントに残す。

`skipLibCheck` は外部ライブラリの型定義都合を吸収するためのみ許可する。
アプリケーションコードの型エラーを隠す目的で使ってはいけない。
`front-end/src/` 配下は `npm run typecheck` と type-aware ESLint の両方で検証する。

### 機械検証

フロントエンドの型安全性は、以下を必須の機械検証とする。

- `npm run typecheck`
- `npm run doc:check`
- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run build:check`
- `npm run check`

完了報告では、原則として `npm run check` の成功を確認する。
個別コマンドだけを実行した場合は、実行したコマンドと未実行の理由を明記する。

ESLintはtype-aware ruleを有効にし、以下をエラーとして扱う。

- `any`
- 浮いたPromise
- nullable値の暗黙的な真偽値判定
- 型だけの通常import
- 未使用import
- 親ディレクトリ相対import
- レイヤー境界違反
- exported functionまたはReact componentの戻り値型不足

TSDocはESLintではなく `scripts/check-tsdoc.mjs` で検証する。
このscriptは `src/` 配下の関数、function代入、type、interface、const、type / interface propertyを対象にする。

### `any` の扱い

`any` は禁止する。

不明な型は `unknown` で受け、型ガードや変換関数で安全に扱う。

以下も禁止する。

- `as any`
- `Array<any>`
- `Record<string, any>`
- `Promise<any>`
- `Function`
- `{}` を「任意object」の意味で使うこと

外部ライブラリ都合で型が欠ける場合は、局所的な型定義、型ガード、adapter関数のいずれかで境界を閉じる。

禁止例：

```ts
const handleError = (error: any) => {
  // ...
};
```

推奨例：

```ts
const handleError = (error: unknown) => {
  // ...
};
```

### 型定義の置き場所

- domain型は `domains/` に置く
- API request / response DTOは `features/*/api/` に置く
- 共通props型は専用の型定義ファイルに置く
- 1つのコンポーネントでしか使わない小さなprops型のみ、同じファイル内に置いてよい
- 型定義が増える場合は、コンポーネントファイルから分離する

### 型名

型名はPascalCaseとする。

例：

```ts
/**
 * 出費。
 */
export type Expense = {
  /** 出費ID */
  id: string;
  /** 出費金額 */
  amount: number;
  /** 出費日時 */
  spentAt: string;
};
```

API DTOは用途が分かる名前にする。

```ts
/**
 * 出費登録request。
 */
export type CreateExpenseRequest = {
  /** 登録する出費金額 */
  amount: number;
};

/**
 * 出費登録response。
 */
export type CreateExpenseResponse = {
  /** 登録した出費 */
  expense: ExpenseResponseDto;
  /** 登録後の月次サマリー */
  monthlySummary: MonthlySummaryResponseDto;
};
```

### type / interface のファイル分離方針

型定義は責務ごとにファイルを分ける。

コンポーネント、hook、usecase、api実装ファイルに型定義を無秩序に増やさない。

#### domain型

domain型は `domains/{domainName}/` 配下に配置する。

例：

```txt
domains/
  expense/
    expense.ts
  income/
    income.ts
  fixedCost/
    fixedCost.ts
```

domain型ファイルには、API DTOやReact props型を置かない。

#### API DTO

API request / response DTOは `features/*/api/*Dto.ts` に配置する。

例：

```txt
features/expense/api/expenseDto.ts
features/income/api/incomeDto.ts
features/fixedCost/api/fixedCostDto.ts
```

`*Dto.ts` にはHTTP通信関数を書かない。

HTTP通信関数は `*Api.ts` に書く。

#### props型

props型は以下の方針で配置する。

```txt
1つのコンポーネントでしか使わない小さなprops型:
  コンポーネントファイル内に置いてよい

複数コンポーネントで使うprops型:
  `components` または `features` 配下の専用型ファイルに分離する

feature固有のprops型:
  `components/{atomicLayer}/{componentName}/{componentName}.types.ts` などへ分離する
```

例：

```txt
components/organisms/ExpenseAmountInput/ExpenseAmountInput.tsx
components/organisms/ExpenseAmountInput/ExpenseAmountInput.types.ts
```

#### hookの戻り値型

custom hookの戻り値型が複雑な場合は、hookファイル内に直接書かず、専用型として分離する。

例：

```txt
features/expense/hooks/useCreateExpenseOnBlur.ts
features/expense/hooks/useCreateExpenseOnBlur.types.ts
```

#### 型定義ファイルの禁止事項

型定義ファイルでは以下を禁止する。

- Reactコンポーネントの実装
- API通信
- hooksの実装
- 副作用のある処理
- 状態管理
- DBや外部サービスへのアクセス
- 複雑な型ガード

型定義ファイルは、型と定数の型補助に留める。

型ガードは単純なものを除き、 `*.guard.ts` に分離する。

例：

```txt
features/expense/api/expenseDto.ts
features/expense/api/expenseDto.guard.ts
domains/expense/expense.ts
domains/expense/expense.guard.ts
```

複数条件の判定、ネストしたobjectの検証、配列要素の検証を含む型ガードは、型定義ファイルに置かない。

#### `types.ts` 乱用禁止

何でも `types.ts` にまとめることは禁止する。

型定義ファイルは、責務が分かる名前にする。

良い例：

```txt
expenseDto.ts
ExpenseAmountInput.types.ts
monthlySummary.ts
apiError.ts
```

悪い例：

```txt
types.ts
commonTypes.ts
dataTypes.ts
```

---

### type / interface propertyコメント

type、interfaceのpropertyには、値が何を表すかを必ず日本語コメントで書く。
props型、DTO型、domain型、style型、hookのparams / result型も対象にする。

良い例:

```ts
type TodayExpensesCardProps = {
  /** 出費 */
  readonly expenses: readonly Expense[];
  /** ローディング中か */
  readonly isLoading: boolean;
  /** 合計金額 */
  readonly total: number;
};
```

悪い例:

```ts
type TodayExpensesCardProps = {
  readonly expenses: readonly Expense[];
  readonly isLoading: boolean;
  readonly total: number;
};
```

## TypeScript詳細ルール

### 型安全性

TypeScriptでは型安全性を最優先する。

以下は禁止する。

- `any`
- `as any`
- 不要な型アサーション
- `// @ts-ignore`
- `// @ts-expect-error` の理由なし利用
- non-null assertion `!` の安易な利用

`unknown` を受け取った場合は、型ガードや変換関数で安全に扱う。

### null / undefined

nullishな値は明示的に扱う。

`strictNullChecks` を前提に、以下を守る。

- `null` と `undefined` を雑に混在させない
- API DTOでnullableな値は `string | null` のように明示する
- optionalとnullableを区別する
- `value || defaultValue` ではなく、意図に応じて `value ?? defaultValue` を使う

### 型推論と明示型

ローカル変数では型推論を活用してよい。

ただし、以下は型を明示する。

- exported functionの引数と戻り値
- custom hookの戻り値
- usecase関数の引数と戻り値
- API関数のrequest / response
- React componentのprops
- domain型
- API DTO

### union型

状態や種別は文字列の直書きではなく、union型で管理する。

```ts
export type AppEnv = "local" | "development" | "production";
```

画面状態も必要に応じてunion型で表現する。

```ts
export type LoadingState = "idle" | "loading" | "success" | "error";
```

### 型の配置

型が複数featureで使われる場合は `domains/` または `libs/` へ移動する。

ただし、1つのコンポーネントでしか使わないprops型は、同じファイル内に置いてよい。

### enumの扱い

TypeScriptの `enum` は原則使用しない。

文字列union型または `as const` を利用する。

```ts
export const incomeBalanceOptions = ["included", "excluded"] as const;
export type IncomeBalanceOption = (typeof incomeBalanceOptions)[number];
```

### type / interface の使い分け

原則として、アプリ内のデータ構造は `type` を使用する。

`interface` は以下の場合のみ利用してよい。

- 外部ライブラリの型拡張が必要な場合
- declaration mergingが必要な場合
- interfaceとして公開する明確な理由がある場合

通常のprops、domain型、DTOでは `type` を優先する。

### 型アサーションの扱い

`as` による型アサーションは最小限にする。

型アサーションが必要な場合は、以下を検討する。

- 型ガードを作る
- DTO変換関数を作る
- zodなどのruntime validation導入を検討する
- APIレスポンス型を見直す

`as any` は禁止する。

### `import type` の扱い

型だけをimportする場合は、必ず `import type` を使う。

値として使うものと型だけで使うものは、importを分ける。

良い例：

```ts
import { formatAmount } from "@/libs/money";
import type { Expense } from "@/domains/expense/expense";
```

悪い例：

```ts
import { Expense } from "@/domains/expense/expense";
```

React component、hook、usecase、api関数の引数や戻り値でだけ使う型は、すべて `import type` にする。

`importsNotUsedAsValues` や `consistent-type-imports` などのlintで機械的に検知できる状態にする。

---
