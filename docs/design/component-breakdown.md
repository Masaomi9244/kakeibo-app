# Component Breakdown

## 目的

`docs/design/mvp-implementation-spec.md` をNext.js、MUI、TanStack Queryで実装するためのコンポーネント分解を定義する。

このファイルは実装時の配置判断を助けるためのものであり、仕様の正は `docs/product/scope.md` と `docs/features/*.md` とする。

## 配置方針

```txt
front-end/src/
  app/
  components/
    atoms/
    molecules/
    organisms/
    templates/
  features/
    {feature}/
      api/
      domain/
      hooks/
      mappers/
      usecases/
  domains/
  libs/
  theme/
```

- `app/`: routeごとの `page.tsx` とlayoutの骨組み
- `components/atoms/`: アプリ全体で統一する最小UI
- `components/molecules/`: atomsやMUIを組み合わせた小さなUI
- `components/organisms/`: 画面の主要ブロック
- `components/templates/`: routeとfeature hooksを接続する画面単位UI
- `features/`: API、hooks、mapper、usecase、feature固有domain型
- `domains/`: 複数featureで共有するdomain型
- `libs/`: API client、format、date、moneyなどの共通処理
- `theme/`: MUI theme

Reactコンポーネントは `components/` 配下にのみ置く。
`features/{feature}/components/` は作らない。

## 共通ルール

- 1ファイル1コンポーネントを原則にする
- JSX内へinline `sx` objectを書かない
- styleは同ディレクトリの `*.styles.ts` へ置く
- dynamic styleも `getXxxSx()` として `*.styles.ts` へ置く
- `const` には、その値が何を表すかを日本語コメントで書く
- type / interface とそのpropertyには日本語コメントを書く
- API DTOをcomponentへ直接渡さない
- TanStack Query、mutation、フォーム制御、保存判断、Snackbar / Undo制御はfeature hookに寄せる
- 日付選択、編集対象、表示用集計などの画面状態は `useXxxPageViewModel` に寄せる
- 入力正規化、初期値生成、表示用の静的データ整形は `features/*/usecases/` に寄せる

## Atoms

Atomsは、見た目や挙動をアプリ全体で揃える最小UI。

現在の主要候補:

```txt
front-end/src/components/atoms/AmountText.tsx
front-end/src/components/atoms/AmountText.styles.ts
```

Atomsに置かないもの:

- API通信
- TanStack Query
- feature固有の文言
- feature固有domain型

## Molecules

Moleculesは、atomsやMUIを組み合わせた小さなUI。

現在の主要候補:

```txt
front-end/src/components/molecules/StatCard.tsx
front-end/src/components/molecules/AmountHeroCard.tsx
front-end/src/components/molecules/CalendarDateCell.tsx
front-end/src/components/molecules/BarMetricColumn.tsx
```

役割:

- `StatCard`: 金額や件数などの概要値を表示する
- `AmountHeroCard`: 画面内で最も強調したい金額を表示する
- `CalendarDateCell`: カレンダーの1日セルを表示する
- `BarMetricColumn`: 年間サマリーの棒グラフ1指標を表示する

## Organisms

Organismsは、画面の主要ブロック。
表示とユーザー操作のprops受け取りを主責務にし、API DTO、TanStack Query、Supabase Clientを直接importしない。

feature固有organismがprops型のために `features/*/domain` の型をimportすることは許可する。

### Layout

```txt
front-end/src/components/organisms/AppShell.tsx
front-end/src/components/organisms/AppSideNav.tsx
front-end/src/components/organisms/AppBottomNav.tsx
```

役割:

- ログイン後画面の共通レイアウト
- PCのサイドナビ
- SPの下部ナビ
- MVP対象画面のみのナビゲーション

### Home

```txt
front-end/src/components/organisms/BudgetHero/BudgetHero.tsx
front-end/src/components/organisms/QuickExpenseInput/QuickExpenseInput.tsx
front-end/src/components/organisms/TodayExpensesCard/TodayExpensesCard.tsx
```

役割:

- `BudgetHero`: 今月の残り予算を表示する
- `QuickExpenseInput`: 金額のみで出費を登録する入力UIを表示する
- `TodayExpensesCard`: 今日の出費一覧と今日の合計を表示する

表示しないもの:

- 出費カテゴリ
- 出費メモ
- 支出専用画面への導線

### Income

```txt
front-end/src/components/organisms/IncomeSummary/IncomeSummary.tsx
front-end/src/components/organisms/IncomeForm/IncomeForm.tsx
front-end/src/components/organisms/IncomeList/IncomeList.tsx
```

役割:

- `IncomeSummary`: 今月の総収入をヒーローカードで表示する
- `IncomeForm`: 収入の登録・編集フォームを表示する
- `IncomeList`: 収入一覧、編集、削除、予算対象切り替えを表示する

表示しないもの:

- 収入カテゴリ

### Fixed Costs

```txt
front-end/src/components/organisms/FixedCostForm/FixedCostForm.tsx
front-end/src/components/organisms/FixedCostList/FixedCostList.tsx
front-end/src/components/organisms/FixedCostList/FixedCostListItem.tsx
```

役割:

- `FixedCostForm`: 固定費登録フォームを表示する
- `FixedCostList`: 固定費一覧、編集、削除、有効状態を表示する
- `FixedCostListItem`: 固定費一覧の1行分と行操作を表示する

表示しないもの:

- 終了月
- 固定費カテゴリ

### Calendar

```txt
front-end/src/components/organisms/MonthCalendar/MonthCalendar.tsx
front-end/src/components/organisms/SelectedDayExpenses/SelectedDayExpenses.tsx
```

役割:

- `MonthCalendar`: 月間カレンダー、日別出費合計、月次集計を表示する
- `SelectedDayExpenses`: 選択日の出費合計と出費一覧を表示する

表示しないもの:

- 出費カテゴリ
- 出費メモ

### Annual Summary

```txt
front-end/src/components/organisms/SummaryChart/SummaryChart.tsx
front-end/src/components/organisms/SummaryPieChart/SummaryPieChart.tsx
```

役割:

- `SummaryChart`: 月別変動費推移を棒グラフ表示する
- `SummaryPieChart`: 年間収入の使い道を円グラフ表示する
- 年間収入の使い道の右カラムには補助指標カードを縦並びで表示する

表示しないもの:

- カテゴリ別支出
- カテゴリ割合
- カテゴリランキング
- 月別サマリー一覧

## Templates

Templatesは、Next.js routeとfeature hooksを接続する画面単位UI。
原則として `useXxxPageViewModel` を呼び、表示はorganismへpropsで渡す。

```txt
front-end/src/components/templates/HomePageContent/HomePageContent.tsx
front-end/src/components/templates/IncomePageContent/IncomePageContent.tsx
front-end/src/components/templates/FixedCostPageContent/FixedCostPageContent.tsx
front-end/src/components/templates/CalendarPageContent/CalendarPageContent.tsx
front-end/src/components/templates/AnnualSummaryPageContent/AnnualSummaryPageContent.tsx
```

Templatesの禁止事項:

- JSX内にAPI DTOのpropertyを直接出す
- DTOからdomain型への変換を書く
- API requestを組み立てる
- mutationを直接呼び出す
- フォーム入力stateを直接持つ
- Snackbar / Undo状態を直接持つ
- 長い入力正規化を書く
- style objectを直接書く

## Features

features配下には処理だけを置く。

```txt
features/home/hooks/useMonthlySummary.ts
features/home/hooks/useTodayExpenses.ts
features/home/hooks/useCreateQuickExpense.ts
features/home/hooks/useUndoExpense.ts
features/home/hooks/useQuickExpenseInput.ts
features/home/usecases/calculateDailySpendingGuide.ts
features/home/usecases/normalizeExpenseAmountInput.ts

features/incomes/api/incomesApi.ts
features/incomes/api/incomeDto.ts
features/incomes/hooks/useIncomes.ts
features/incomes/hooks/useCreateIncome.ts
features/incomes/hooks/useUpdateIncome.ts
features/incomes/hooks/useDeleteIncome.ts
features/incomes/mappers/incomeMapper.ts
features/incomes/usecases/normalizeIncomeForm.ts
features/incomes/usecases/createEmptyIncomeFormValues.ts
features/incomes/usecases/mapIncomeToFormValues.ts
features/incomes/usecases/calculateIncomeTotals.ts

features/fixed-costs/domain/fixedCost.ts
features/fixed-costs/api/fixedCostDto.ts
features/fixed-costs/api/fixedCostsApi.ts
features/fixed-costs/hooks/useFixedCostPageViewModel.ts
features/fixed-costs/hooks/useFixedCosts.ts
features/fixed-costs/hooks/useCreateFixedCost.ts
features/fixed-costs/hooks/useUpdateFixedCost.ts
features/fixed-costs/hooks/useDeleteFixedCost.ts
features/fixed-costs/hooks/invalidateFixedCostCaches.ts
features/fixed-costs/mappers/fixedCostMapper.ts
features/fixed-costs/usecases/calculateFixedCostTotals.ts
features/fixed-costs/usecases/createEmptyFixedCostFormValues.ts
features/fixed-costs/usecases/mapFixedCostToFormValues.ts
features/fixed-costs/usecases/normalizeFixedCostForm.ts

features/calendar/domain/calendar.ts
features/calendar/api/expenseCalendarApi.ts
features/calendar/api/expenseCalendarDto.ts
features/calendar/hooks/useCalendarPageViewModel.ts
features/calendar/hooks/useExpenseCalendar.ts
features/calendar/mappers/expenseCalendarMapper.ts
features/calendar/usecases/calculateCalendarMonthStats.ts
features/calendar/usecases/createCalendarCells.ts
features/calendar/usecases/createSelectedExpenseItems.ts
features/calendar/usecases/formatCalendarDateLabel.ts
features/calendar/usecases/formatCalendarMonthLabel.ts
features/calendar/usecases/getCalendarWeekDays.ts
features/calendar/usecases/shiftCalendarMonth.ts

features/annual-summary/domain/annualSummary.ts
features/annual-summary/api/annualSummaryApi.ts
features/annual-summary/api/annualSummaryDto.ts
features/annual-summary/hooks/useAnnualSummaryPageViewModel.ts
features/annual-summary/hooks/useAnnualSummary.ts
features/annual-summary/mappers/annualSummaryMapper.ts
features/annual-summary/usecases/calculateAnnualSummaryTotals.ts
features/annual-summary/usecases/createAnnualMonthlySummaries.ts
features/annual-summary/usecases/createAnnualSummaryChartMetrics.ts
features/annual-summary/usecases/createAnnualSummaryStatCards.ts
features/annual-summary/usecases/findHighestExpenseMonth.ts
```

## 実装時に作らないコンポーネント

以下はMVPでは作らない。

- `ExpensePageContent`
- `ExpenseForm`
- `ExpenseCategorySelect`
- `ExpenseMemoInput`
- `ExpenseCategoryChart`
- `SettingsPageContent`
- `CategoryList`
- `BudgetCategoryForm`

## 実装順序

1. App shellとナビゲーション
2. 共通UI
3. ログイン画面
4. トップ画面
5. 収入画面
6. 固定費画面
7. カレンダー画面
8. 年間サマリー画面
9. PWA表示設定

トップ画面はMVP価値の中心なので、最初にUIと入力挙動を固める。
