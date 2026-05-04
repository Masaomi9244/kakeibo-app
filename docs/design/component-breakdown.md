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
  features/
  domains/
  libs/
  theme/
```

- `app/`: routeごとの `page.tsx` とlayoutの骨組み
- `components/atoms/`: アプリ全体で統一する最小UI
- `components/molecules/`: atomsやMUIを組み合わせた小さな汎用UI
- `components/organisms/`: 複数featureで使う大きめの共通UI
- `features/`: 画面固有のUI、hook、api、mapper
- `domains/`: domain型
- `libs/`: API client、format、date、moneyなどの共通処理
- `theme/`: MUI theme

共通化の判断:

- 1つのfeatureでしか使わないUIは `features/{feature}/components/` に置く
- 2つ以上のfeatureで実利用するUIだけ `components/` に移す
- `components/` 配下には業務ロジック、API DTO、TanStack Queryを入れない
- Atomic Designは厳密な分類よりも、依存方向と責務の小ささを優先する

## Shared Components

### Atoms

Atomsは、見た目や挙動をアプリ全体で揃える最小UI。
MUIをそのまま使ってよいが、複数画面で統一したいものだけラップする。

作成候補:

```txt
front-end/src/components/atoms/AppButton.tsx
front-end/src/components/atoms/AppTextField.tsx
front-end/src/components/atoms/AmountText.tsx
front-end/src/components/atoms/DateText.tsx
front-end/src/components/atoms/AppIconButton.tsx
```

Atomsに入れないもの:

- API通信
- feature固有の文言
- `income`、`expense`、`fixedCost` などのdomain知識
- TanStack Query

### Molecules

Moleculesは、atomsやMUIを組み合わせた小さな汎用UI。
複数featureで同じ表示パターンを使う場合だけ置く。

作成候補:

```txt
front-end/src/components/molecules/StatCard.tsx
front-end/src/components/molecules/PageHeader.tsx
front-end/src/components/molecules/EmptyState.tsx
front-end/src/components/molecules/ErrorMessage.tsx
front-end/src/components/molecules/LoadingState.tsx
```

役割:

- `StatCard`: 金額や件数などの概要値を表示する
- `PageHeader`: 画面タイトルと補足説明を表示する
- `EmptyState`: データがない状態を表示する
- `ErrorMessage`: APIエラーや入力エラーを表示する
- `LoadingState`: 読み込み中を表示する

### Organisms

Organismsは、複数featureで使う大きめの共通UI。
画面固有のデータ取得やmutationは持たず、表示とナビゲーションの骨組みに寄せる。

### `AppShell`

役割:

- ログイン後画面の共通レイアウト
- PCではサイドナビ
- スマホでは下部ナビ
- コンテンツ幅と背景色の管理

配置候補:

```txt
front-end/src/components/organisms/AppShell.tsx
```

Props:

```txt
children
currentPath
onLogout
```

### `AppSideNav`

役割:

- PC用ナビゲーション
- MVP画面だけを表示する
- 下部にログアウト導線を置く

表示項目:

- ホーム
- 収入
- 固定費
- カレンダー
- 年間
- ログアウト

表示しない項目:

- 支出
- 設定

配置候補:

```txt
front-end/src/components/organisms/AppSideNav.tsx
```

### `AppBottomNav`

役割:

- スマホ用下部ナビゲーション

表示項目:

- ホーム
- 収入
- 固定費
- カレンダー
- 年間

表示しない項目:

- 支出
- 設定

配置候補:

```txt
front-end/src/components/organisms/AppBottomNav.tsx
```

### `UserMenu`

役割:

- スマホでログアウト導線を置く
- 設定画面へは遷移しない

配置候補:

```txt
front-end/src/components/organisms/UserMenu.tsx
```

## Home Feature

### `HomePageContent`

役割:

- トップ画面全体のfeature component
- 月次サマリー、今日の出費、出費入力をまとめる

配置候補:

```txt
front-end/src/features/home/components/HomePageContent.tsx
```

### `MonthlyAvailableBalanceCard`

役割:

- 「今月残り使える金額」を最も目立つ形で表示する
- 今日使える目安も同じカード内に表示してよい

表示:

- 今月残り使える金額
- 今日使える目安

配置候補:

```txt
front-end/src/features/home/components/MonthlyAvailableBalanceCard.tsx
```

### `QuickExpenseInput`

役割:

- トップ画面から金額のみで出費登録する

表示するもの:

- 金額入力欄
- 保存中状態
- 入力エラー

表示しないもの:

- カテゴリ選択
- メモ入力
- 登録ボタン

挙動:

- blurで保存する
- Enterで保存する
- 保存成功後に入力欄を空にする
- 保存成功後にUndo snackbarを表示する
- 保存失敗時は入力値を残す
- Enter直後のblurで二重保存しない

配置候補:

```txt
front-end/src/features/home/components/QuickExpenseInput.tsx
```

関連hook候補:

```txt
front-end/src/features/home/hooks/useQuickExpenseInput.ts
```

### `UndoExpenseSnackbar`

役割:

- 最後に登録した出費1件のUndoを3秒間表示する

配置候補:

```txt
front-end/src/features/home/components/UndoExpenseSnackbar.tsx
```

### `TodayExpenseList`

役割:

- Asia/Tokyo基準の今日の出費一覧を表示する

表示するもの:

- 金額
- 時刻

表示しないもの:

- カテゴリ
- メモ
- 支出専用画面への導線

配置候補:

```txt
front-end/src/features/home/components/TodayExpenseList.tsx
```

### `MonthlyBreakdown`

役割:

- 今月の簡易内訳を表示する

表示:

- 使える収入
- 固定費
- 出費

配置候補:

```txt
front-end/src/features/home/components/MonthlyBreakdown.tsx
```

## Auth Feature

### `LoginForm`

役割:

- メールアドレスとパスワードでログインする

表示するもの:

- メールアドレス入力
- パスワード入力
- ログインボタン
- ログイン失敗エラー

表示しないもの:

- 新規登録
- パスワード再設定
- SNSログイン
- デモ用文言

配置候補:

```txt
front-end/src/features/auth/components/LoginForm.tsx
```

## Income Feature

### `IncomePageContent`

役割:

- 収入画面全体のfeature component

配置候補:

```txt
front-end/src/features/incomes/components/IncomePageContent.tsx
```

### `IncomeForm`

役割:

- 収入を追加または編集する

入力:

- 金額
- 収入日
- メモ
- 今月使えるお金に含めるか

表示しないもの:

- 収入カテゴリ

配置候補:

```txt
front-end/src/features/incomes/components/IncomeForm.tsx
```

### `IncomeList`

役割:

- 収入一覧、編集、削除を表示する

配置候補:

```txt
front-end/src/features/incomes/components/IncomeList.tsx
```

## Fixed Cost Feature

### `FixedCostPageContent`

役割:

- 固定費画面全体のfeature component

配置候補:

```txt
front-end/src/features/fixed-costs/components/FixedCostPageContent.tsx
```

### `FixedCostForm`

役割:

- 固定費を追加または編集する

入力:

- 固定費名
- 金額
- 開始月
- 有効かどうか

表示しないもの:

- 終了月
- 固定費カテゴリ

配置候補:

```txt
front-end/src/features/fixed-costs/components/FixedCostForm.tsx
```

### `FixedCostList`

役割:

- 固定費一覧、編集、削除を表示する

配置候補:

```txt
front-end/src/features/fixed-costs/components/FixedCostList.tsx
```

## Calendar Feature

### `CalendarPageContent`

役割:

- カレンダー画面全体のfeature component

配置候補:

```txt
front-end/src/features/calendar/components/CalendarPageContent.tsx
```

### `MonthlyCalendar`

役割:

- 月間カレンダーを表示する
- 日付選択を扱う

各日に表示するもの:

- 日付
- その日の出費合計
- その日終了時点の残額

表示しないもの:

- カテゴリ

配置候補:

```txt
front-end/src/features/calendar/components/MonthlyCalendar.tsx
```

### `SelectedDayExpenseList`

役割:

- 選択日の出費明細を表示する

表示するもの:

- 金額
- 時刻

表示しないもの:

- カテゴリ
- メモ

配置候補:

```txt
front-end/src/features/calendar/components/SelectedDayExpenseList.tsx
```

## Annual Summary Feature

### `AnnualSummaryPageContent`

役割:

- 年間サマリー画面全体のfeature component

配置候補:

```txt
front-end/src/features/annual-summary/components/AnnualSummaryPageContent.tsx
```

### `AnnualSummaryCards`

役割:

- 年間サマリーの概要値を表示する

表示するもの:

- 年間全収入
- 年間使える収入
- 年間貯める収入
- 年間固定費
- 年間出費
- 年間実収支
- 年間生活費残り

配置候補:

```txt
front-end/src/features/annual-summary/components/AnnualSummaryCards.tsx
```

### `MonthlySummaryTable`

役割:

- 月別サマリー一覧を表示する

表示するもの:

- 全収入
- 使える収入
- 貯める収入
- 固定費
- 出費
- 実収支
- 生活費残り

配置候補:

```txt
front-end/src/features/annual-summary/components/MonthlySummaryTable.tsx
```

### `AnnualTrendChart`

役割:

- 月別の収入、固定費、出費、生活費残りの推移を表示する

表示しないもの:

- カテゴリ別支出
- カテゴリ割合
- カテゴリランキング

配置候補:

```txt
front-end/src/features/annual-summary/components/AnnualTrendChart.tsx
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

## Query / API hook候補

```txt
features/home/hooks/useMonthlySummary.ts
features/home/hooks/useTodayExpenses.ts
features/home/hooks/useCreateQuickExpense.ts
features/home/hooks/useUndoExpense.ts

features/incomes/hooks/useIncomes.ts
features/incomes/hooks/useCreateIncome.ts
features/incomes/hooks/useUpdateIncome.ts
features/incomes/hooks/useDeleteIncome.ts

features/fixed-costs/hooks/useFixedCosts.ts
features/fixed-costs/hooks/useCreateFixedCost.ts
features/fixed-costs/hooks/useUpdateFixedCost.ts
features/fixed-costs/hooks/useDeleteFixedCost.ts

features/calendar/hooks/useExpenseCalendar.ts
features/annual-summary/hooks/useAnnualSummary.ts
```

query keyは各feature内で共通化し、componentに直書きしない。

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
