# Frontend Domain / API Hooks Design

## 目的

フロントエンド実装でdomain型、API DTO、mapper、TanStack Query hooksの責務がぶれないように設計方針を定義する。

このファイルは実装前の設計メモであり、API契約の正は `docs/api/*.md`、画面仕様の正は `docs/features/*.md` とする。

## 基本方針

- APIレスポンス型とUIで使うdomain型を分ける
- componentはAPI DTOを直接importしない
- API関数はHTTP通信とDTOの受け渡しだけを担当する
- DTOからdomain型への変換はmapperに置く
- hookはdomain型または画面用view modelを返す
- templateは画面用view model hookを呼び出し、componentsへpropsを渡すだけに寄せる
- フォーム制御、保存判断、API mutation呼び出し、Snackbar / Undo制御はtemplateに置かずfeature hookへ寄せる
- 日付選択、一覧編集、削除、画面内集計などの画面状態は `useXxxPageViewModel` に集約する
- 入力正規化、初期値生成、表示用の静的データ整形、集計補助は `features/{feature}/usecases/` に分離する
- query keyはfactoryで定義し、componentに直書きしない
- 残額、固定費対象月、日別残額、年間集計の正計算はバックエンドに任せる

## ディレクトリ方針

```txt
front-end/src/
  domains/
    expense.ts
    income.ts
    fixedCost.ts
    monthlySummary.ts
    expenseCalendar.ts
    annualSummary.ts

  features/
    home/
      api/
      domain/
      hooks/
      mappers/
      usecases/
    incomes/
      api/
      domain/
      hooks/
      mappers/
      usecases/
    fixed-costs/
      api/
      domain/
      hooks/
      mappers/
      usecases/
    calendar/
      api/
      domain/
      hooks/
      mappers/
      usecases/
    annual-summary/
      api/
      domain/
      hooks/
      mappers/
      usecases/

  libs/
    date.ts
    money.ts
    queryKeys.ts
```

## Domain型

Domain型はUIやfeature間で扱う中心的な型とする。
表示用文字列は持たせず、format済みの値はcomponentまたはview modelで作る。

### `Expense`

```ts
export type Expense = {
  id: string;
  amount: number;
  spentAt: string;
};
```

補足:

- `spentAt` はAPIのISO文字列を保持する
- 表示時はAsia/Tokyo基準でformatする
- MVPではカテゴリとメモを持たない

### `Income`

```ts
export type Income = {
  id: string;
  amount: number;
  incomeDate: string;
  memo: string | null;
  includedInBalance: boolean;
};
```

補足:

- `incomeDate` は `YYYY-MM-DD`
- `memo` は空文字ではなく `null` に正規化して扱う
- 収入カテゴリは持たない

### `FixedCost`

```ts
export type FixedCost = {
  id: string;
  name: string;
  amount: number;
  startMonth: string;
  isActive: boolean;
};
```

補足:

- `startMonth` は月初日の `YYYY-MM-DD`
- MVPでは終了月を持たない
- 固定費カテゴリは持たない

### `MonthlySummary`

```ts
export type MonthlySummary = {
  month: string;
  totalIncome: number;
  availableIncome: number;
  reservedIncome: number;
  fixedCostTotal: number;
  expenseTotal: number;
  remainingAmount: number;
  actualBalance: number;
};
```

補足:

- `month` は `YYYY-MM`
- 画面上の正計算はAPIレスポンスを正とする

### `ExpenseCalendar`

```ts
export type ExpenseCalendarDay = {
  date: string;
  expenseTotal: number;
  remainingAmount: number;
};

export type ExpenseCalendar = {
  month: string;
  availableIncome: number;
  fixedCostTotal: number;
  days: ExpenseCalendarDay[];
};
```

補足:

- `date` は `YYYY-MM-DD`
- `days` はカレンダー表示に必要な日付を含む
- フロント側で日別残額を再計算しない

### `AnnualSummary`

```ts
export type AnnualSummaryMonth = {
  month: string;
  totalIncome: number;
  availableIncome: number;
  reservedIncome: number;
  fixedCostTotal: number;
  expenseTotal: number;
  actualBalance: number;
  availableBalance: number;
};

export type AnnualSummary = {
  year: number;
  totalIncome: number;
  availableIncome: number;
  reservedIncome: number;
  fixedCostTotal: number;
  expenseTotal: number;
  actualBalance: number;
  availableBalance: number;
  months: AnnualSummaryMonth[];
};
```

補足:

- `availableBalance` は年間生活費残りとして保持するが、年間サマリー上部カードには表示しない
- `総貯蓄` という表示名は使わない
- カテゴリ別支出は持たない

## API DTO方針

DTOは `features/{feature}/api/` に置く。
APIのJSON構造と同じ形にし、domain型とは分ける。

例:

```txt
features/home/api/expenseDto.ts
features/home/api/monthlySummaryDto.ts
features/incomes/api/incomeDto.ts
features/fixed-costs/api/fixedCostDto.ts
features/calendar/api/expenseCalendarDto.ts
features/annual-summary/api/annualSummaryDto.ts
```

命名:

- request: `CreateExpenseRequest`
- response: `CreateExpenseResponse`
- item DTO: `ExpenseDto`

禁止:

- DBカラム名のsnake_caseをDTOに持ち込む
- DTOをcomponent propsに直接使う
- DTOをdomain型として再exportする

## Mapper方針

mapperはDTOからdomain型への変換だけを担当する。

置き場所:

```txt
features/{feature}/mappers/*.ts
```

mapperで行ってよいこと:

- `memo: ""` を `null` に寄せる
- API DTO配列をdomain配列へ変換する
- 画面が扱いやすい名前へそろえる

mapperで行わないこと:

- 金額の表示format
- 日付の表示format
- 残額の再計算
- API呼び出し
- React state操作

## Query Key方針

query keyはfactoryで定義する。
componentやhook内に配列を直書きしない。

## Page View Model Hook方針

画面templateは、原則としてfeature hookの `useXxxPageViewModel` を1つ呼び出し、返ってきた値をorganismへpropsとして渡す。

対象:

- `features/home/hooks/useHomePageViewModel.ts`
- `features/incomes/hooks/useIncomePageViewModel.ts`
- `features/fixed-costs/hooks/useFixedCostPageViewModel.ts`
- `features/calendar/hooks/useCalendarPageViewModel.ts`
- `features/annual-summary/hooks/useAnnualSummaryPageViewModel.ts`

`useXxxPageViewModel` に置くもの:

- フォーム入力state
- 保存可否判断
- API mutation呼び出し
- 編集対象、選択日などの画面内状態
- Snackbar / Undo制御
- componentへ渡す表示用view model

`useXxxPageViewModel` に置かずusecaseへ分けるもの:

- 入力値の正規化
- form初期値生成
- domain値から表示用集計値への変換
- モックや静的データの整形

Templatesの禁止事項:

- `useState` でフォームや選択状態を持つ
- API mutationを直接呼び出す
- `reduce` などで画面集計を直接行う
- 入力値の正規化やrequest組み立てを行う

候補:

```ts
monthlySummaryKeys.detail(month);
expensesKeys.byMonth(month);
expensesKeys.byDate(date);
incomesKeys.byMonth(month);
fixedCostsKeys.byMonth(month);
expenseCalendarKeys.byMonth(month);
expenseCalendarKeys.byMonthAndDate(month, date);
annualSummaryKeys.byYear(year);
```

keyに含める値:

- `month`: `YYYY-MM`
- `date`: `YYYY-MM-DD`
- `year`: number

keyに含めない値:

- access token
- user id
- format済みラベル
- UIの開閉状態

## Hooks設計

hooksはTanStack Query、mutation、UIイベントに近い状態制御を担当する。
componentへはdomain型、loading状態、error状態、操作関数、または画面用view modelを返す。

### Page View Model Hooks

画面単位でAPI取得、mutation、フォーム状態、保存判断、Snackbar / Undo制御がまとまる場合は `useXxxPageViewModel` を作る。

配置:

```txt
features/home/hooks/useHomePageViewModel.ts
features/incomes/hooks/useIncomePageViewModel.ts
```

責務:

- templateへ渡す表示状態をまとめる
- templateへ渡すevent handlerをまとめる
- API mutation呼び出しを集約する
- 入力値をusecaseで正規化してから保存する
- Snackbar、Undo、編集状態など画面都合の状態を持つ

禁止:

- JSXを返す
- MUI componentをimportする
- style objectを持つ
- API DTOをcomponentへ渡す
- DTOからdomain型への変換を直接書く

template側の責務:

- `useXxxPageViewModel` を呼ぶ
- organisms / moleculesへpropsを渡す
- loading / error / Snackbarなどの表示部品を配置する
- 保存可否判断やrequest組み立てをしない
- organismへ渡すprops mappingは、template隣接の `*.props.ts` にある型付き変換関数へ寄せる
- feature hookの戻り値をJSX propsへ直接展開しない
- template内に3項目以上のprops objectを直接定義しない
- `undefined` を含む値からpropsを作る条件分岐はtemplateへ置かず、`*.props.ts` の変換関数へ寄せる

### Auth

```txt
features/auth/hooks/useLogin.ts
features/auth/hooks/useLogout.ts
features/auth/hooks/useAuthSession.ts
```

責務:

- ログイン
- ログアウト
- セッション確認
- access token取得
- ログイン済み / 未ログインの判定

### Home

```txt
features/home/hooks/useMonthlySummary.ts
features/home/hooks/useTodayExpenses.ts
features/home/hooks/useCreateQuickExpense.ts
features/home/hooks/useUndoExpense.ts
features/home/hooks/useQuickExpenseInput.ts
features/home/hooks/useHomePageViewModel.ts
```

責務:

- `useMonthlySummary`: 対象月の月次サマリーを取得する
- `useTodayExpenses`: Asia/Tokyo基準の今日の出費を取得する
- `useCreateQuickExpense`: 金額のみで出費を登録する
- `useUndoExpense`: 最後に登録した出費を削除する
- `useQuickExpenseInput`: 入力値、blur、Enter、二重登録防止、保存失敗表示を扱う
- `useHomePageViewModel`: ホーム画面のAPI取得、出費登録、Undo通知、表示用計算をtemplate向けにまとめる

mutation後の更新:

- 出費登録成功時は、関連cacheのinvalidateを基本とする
- レスポンスの `monthlySummary` は月次サマリー取得APIより項目が少ないため、完全な `MonthlySummary` cacheとして丸ごと上書きしない
- 体感速度を優先してcache更新する場合は、既存cacheがある場合に限り、レスポンスに含まれる項目だけを部分更新する
- 今日の出費一覧をinvalidateする
- 対象月の出費一覧をinvalidateする
- 対象月のカレンダーをinvalidateする
- 対象年の年間サマリーをinvalidateする
- Undo成功時も同じ関連cacheをinvalidateする

### Incomes

```txt
features/incomes/hooks/useIncomes.ts
features/incomes/hooks/useCreateIncome.ts
features/incomes/hooks/useUpdateIncome.ts
features/incomes/hooks/useDeleteIncome.ts
features/incomes/hooks/useIncomePageViewModel.ts
```

責務:

- `useIncomes`: 対象月の収入一覧を取得する
- `useCreateIncome`: 収入を登録する
- `useUpdateIncome`: 収入を更新する
- `useDeleteIncome`: 収入を削除する
- `useIncomePageViewModel`: 収入画面のフォーム制御、保存判断、編集、削除、予算対象切り替えをtemplate向けにまとめる

mutation後の更新:

- 対象月の収入一覧をinvalidateする
- 対象月の月次サマリーをinvalidateする
- 対象月のカレンダーをinvalidateする
- 対象年の年間サマリーをinvalidateする

### Fixed Costs

```txt
features/fixed-costs/hooks/useFixedCosts.ts
features/fixed-costs/hooks/useCreateFixedCost.ts
features/fixed-costs/hooks/useUpdateFixedCost.ts
features/fixed-costs/hooks/useDeleteFixedCost.ts
```

mutation後の更新:

- 対象月の固定費一覧をinvalidateする
- 対象月の月次サマリーをinvalidateする
- 対象月のカレンダーをinvalidateする
- 対象年の年間サマリーをinvalidateする

補足:

- 固定費は開始月以降の月次計算に影響するため、将来的には複数月のinvalidateが必要になる
- MVPでは現在表示中の対象月と対象年を確実に更新する

### Calendar

```txt
features/calendar/hooks/useExpenseCalendar.ts
features/calendar/hooks/useCalendarPageViewModel.ts
```

責務:

- 対象月のカレンダーを取得する
- 選択日の出費明細を同じカレンダーAPI responseから取得する
- 月移動時にquery keyを切り替える
- 選択日変更時に `expenseCalendarKeys.byMonthAndDate(month, date)` でquery keyを切り替える

禁止:

- フロントで日別残額を再計算する
- カテゴリ別表示用の状態を持つ

### Annual Summary

```txt
features/annual-summary/hooks/useAnnualSummary.ts
```

責務:

- 対象年の年間サマリーを取得する
- 最多支出月などの補助表示に必要な月別データを整形する
- グラフ用データへ整形する

禁止:

- カテゴリ別支出を作る
- カテゴリランキングを作る
- `総貯蓄` という表示名に変換する

## 入力usecase

UIから独立してテストしたい処理は `features/{feature}/usecases/` または `libs/` に置く。

候補:

```txt
features/home/usecases/normalizeExpenseAmountInput.ts
features/home/usecases/calculateDailySpendingGuide.ts
features/incomes/usecases/normalizeIncomeForm.ts
features/incomes/usecases/createEmptyIncomeFormValues.ts
features/incomes/usecases/mapIncomeToFormValues.ts
features/incomes/usecases/calculateIncomeTotals.ts
libs/money.ts
libs/date.ts
```

`normalizeExpenseAmountInput` の責務:

- カンマ除去
- 全角数字を半角数字へ変換
- 整数化
- 0円以下を拒否
- 小数を拒否
- マイナス値を拒否

`normalizeIncomeForm` の責務:

- 金額入力を1円以上の整数へ正規化する
- 入金日の空文字を拒否する
- 空の収入メモを `null` へ寄せる
- API requestへ渡せる形に変換する

`libs/date.ts` の責務:

- Asia/Tokyo基準の今日を返す
- `YYYY-MM` を扱う
- `YYYY-MM-DD` を扱う
- 年を扱う

## APIとhook対応表

| API                           | API関数候補          | hook候補                                     | domain            |
| ----------------------------- | -------------------- | -------------------------------------------- | ----------------- |
| `POST /api/expenses`          | `createExpense`      | `useCreateQuickExpense`                      | `Expense`         |
| `GET /api/expenses?month=`    | `getExpensesByMonth` | 必要になった時点で追加                       | `Expense[]`       |
| `GET /api/expenses?date=`     | `getExpensesByDate`  | `useTodayExpenses`                           | `Expense[]`       |
| `DELETE /api/expenses/:id`    | `deleteExpense`      | `useUndoExpense`                             | none              |
| `GET /api/monthly-summary`    | `getMonthlySummary`  | `useMonthlySummary`                          | `MonthlySummary`  |
| `GET /api/incomes`            | `getIncomes`         | `useIncomes`                                 | `Income[]`        |
| `POST /api/incomes`           | `createIncome`       | `useCreateIncome`                            | `Income`          |
| `PUT /api/incomes/:id`        | `updateIncome`       | `useUpdateIncome`                            | `Income`          |
| `DELETE /api/incomes/:id`     | `deleteIncome`       | `useDeleteIncome`                            | none              |
| `GET /api/fixed-costs`        | `getFixedCosts`      | `useFixedCosts`                              | `FixedCost[]`     |
| `POST /api/fixed-costs`       | `createFixedCost`    | `useCreateFixedCost`                         | `FixedCost`       |
| `PUT /api/fixed-costs/:id`    | `updateFixedCost`    | `useUpdateFixedCost`                         | `FixedCost`       |
| `DELETE /api/fixed-costs/:id` | `deleteFixedCost`    | `useDeleteFixedCost`                         | none              |
| `GET /api/expense-calendar`   | `getExpenseCalendar` | `useExpenseCalendar`                         | `ExpenseCalendar` |
| `GET /api/annual-summary`     | `getAnnualSummary`   | `useAnnualSummary`                           | `AnnualSummary`   |

## エラー処理

APIエラーは `ApiErrorResponse` に合わせて扱う。

hookがcomponentへ返すエラーは以下にそろえる。

```ts
export type UiError = {
  message: string;
  fieldErrors?: {
    field: string;
    message: string;
  }[];
};
```

方針:

- 入力エラーは入力欄の近くに表示する
- APIエラーは該当画面または該当フォームの近くに表示する
- 401はログイン状態の再確認または `/login` 遷移へつなげる
- エラーを `console.error` だけで握りつぶさない

## 実装前チェック

- DTOとdomain型を同一ファイルに混ぜていない
- componentがDTOをimportしていない
- query keyをcomponentに直書きしていない
- mutation後のinvalidate対象が決まっている
- 残額をフロントで再計算していない
- 出費カテゴリ用の型を作っていない
- 出費メモ用の型を作っていない
- `/expenses` 用hookを作っていない
- `/settings` 用hookを作っていない
