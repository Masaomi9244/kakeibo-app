> This document is archived.
>
> 新規実装や仕様判断の正として扱わないでください。
> 現在の正は `../README.md` から辿れる分割済みドキュメントです。

# 家計簿アプリ MVP仕様書

## アプリ概要

本アプリは、自分だけが利用する個人向け家計管理アプリである。

一般的な家計簿アプリのように細かいカテゴリ分析を目的とするのではなく、「今月あといくら使えるか」を最短で把握することを主目的とする。

出費入力の手間を極力減らし、トップ画面から金額だけをすばやく登録できるようにする。

---

## MVPの目的

### 目的

- 今月残り使える金額をすぐ確認できる
- 出費を最短導線で登録できる
- 収入、固定費、出費をもとに残額を自動計算できる
- カレンダーで日別の出費と残額を確認できる
- 年間の収支をざっくり確認できる
- ログインした本人だけが利用できる
- スマホのホーム画面からアプリのように起動できる

### やらないこと

MVPでは以下は対応しない。

- 出費カテゴリ管理
- レシート画像保存
- 複数ユーザーでの共有
- 予算カテゴリ別管理
- 銀行口座連携
- クレジットカード連携
- CSVインポート
- 通知機能
- 新規ユーザー登録画面
- CSVエクスポート

---

## 基本方針

### アプリの思想

このアプリでは「何に使ったか」よりも「あといくら使えるか」を重視する。

そのため、出費にはカテゴリを持たせない。

ユーザーが最も頻繁に行う操作は出費入力であるため、トップ画面で金額だけを入力できるようにする。

### 残額計算

今月残り使える金額は以下で計算する。

```txt
今月残り使える金額
= 今月の使える収入合計
- 今月の固定費合計
- 今月の出費合計
```

### 収入の扱い

収入は複数登録できる。

ただし、ボーナスや貯金したい臨時収入などは、「収入として記録するが、今月使える金額には含めない」ことができる。

そのため、収入には以下のフラグを持たせる。

```txt
included_in_balance
```

意味は以下。

```txt
true:
  今月使える金額に含める

false:
  収入として記録するが、今月使える金額には含めない
```

---

## 技術スタック

### フロントエンド

- Next.js
- TypeScript
- MUI
- Atomic Design寄りのコンポーネント設計
- features / usecases / domains を意識した構成

### スマホホーム画面対応

MVPでスマホのホーム画面追加に対応する。

SafariやChromeの「ホーム画面に追加」から、アプリのように起動できる状態を目指す。

対応内容は以下とする。

- Web App Manifestを用意する
- アプリアイコンを用意する
- iOS向けのapple-touch-iconを用意する
- theme-colorを設定する
- スマホ表示を前提にレスポンシブ対応する

Service Workerによるオフライン対応はMVPでは必須にしない。

### バックエンド

- Go
- Echo
- GORM
- オニオンアーキテクチャ

### 認証

- Supabase Auth
- 新規登録画面は作らない
- 管理者がSupabase側でユーザーを事前作成する
- ログイン済みユーザーのみアプリを利用可能にする

### DB

- PostgreSQL
- Supabase PostgreSQLを想定

### インフラ

MVPでは最小構成を優先する。

想定構成は以下。

```txt
Frontend:
  Vercel

Backend:
  Render / Fly.io / Railway など

Auth:
  Supabase Auth

DB:
  Supabase PostgreSQL
```

AWS構成はMVP完成後に検討する。

---

## 画面一覧

| パス | 画面名 | 概要 |
|---|---|---|
| `/login` | ログイン画面 | ログインする |
| `/` | トップ画面 | 残額確認と出費入力 |
| `/incomes` | 収入画面 | 収入を登録・一覧表示する |
| `/fixed-costs` | 固定費画面 | 固定費を登録・一覧表示する |
| `/calendar` | カレンダー画面 | 日別の出費と残額を見る |
| `/annual-summary` | 年間サマリー画面 | 年間収支を見る |

---

## 認証仕様

### ログイン

ログイン画面では、メールアドレスとパスワードでログインする。

### 新規登録

MVPでは新規登録画面は作らない。

ユーザーはSupabase Auth側で事前作成する。

### アクセス制御

未ログイン状態では、以下の画面にアクセスできない。

- `/`
- `/incomes`
- `/fixed-costs`
- `/calendar`
- `/annual-summary`

未ログインの場合は `/login` にリダイレクトする。

### API認証

Next.jsからGo APIへリクエストする際は、Supabase Authのアクセストークンを送信する。

```txt
Authorization: Bearer <access_token>
```

Go API側ではトークンを検証し、ログインユーザーのIDを取得する。

APIでは必ずログインユーザー本人のデータのみ取得・更新する。

---

## トップ画面仕様

### 目的

トップ画面では、今月残り使える金額を確認し、出費をすばやく登録できるようにする。

### 表示内容

トップ画面には以下を表示する。

- 今月残り使える金額
- 出費金額入力欄
- 出費登録後のUndo表示
- 今日の出費一覧
- 今月の簡易内訳

### 画面イメージ

```txt
今月残り使える金額
38,420円

[ 使った金額を入力 ]

780円を登録しました  [取り消す]

今日の出費
- 780円
- 1,200円
- 160円

今月の内訳
使える収入  250,000円
固定費      120,000円
出費         91,580円
```

### 出費入力仕様

出費入力欄に金額を入力し、フォーカスアウトしたタイミングで出費を登録する。

保存成功後、入力欄をクリアする。

### 入力バリデーション

以下の場合は保存しない。

- 空欄
- 0円以下
- 数字以外
- 保存処理中

### Undo仕様

出費登録後、3秒間Undoを表示する。

```txt
780円を登録しました  [取り消す]
```

Undoを押した場合、直前に登録した出費を削除する。

Undo成功後、今月残り使える金額と今日の出費一覧を再取得または更新する。

### 今日の出費一覧

トップ画面には当日の出費一覧を表示する。

表示内容は金額のみとする。

```txt
今日の出費
- 780円
- 1,200円
- 160円
```

---

## 収入画面仕様

### 目的

収入を登録・編集・削除できるようにする。

収入は複数登録可能とする。

### 入力項目

| 項目 | 必須 | 内容 |
|---|---|---|
| 金額 | 必須 | 収入金額 |
| 日付 | 必須 | 収入が発生した日 |
| メモ | 任意 | 給料、ボーナス、臨時収入など |
| 今月使えるお金に含める | 必須 | 残額計算に含めるかどうか |

### 画面イメージ

```txt
収入を追加

金額
[ 250000 ]

日付
[ 2026-05-25 ]

メモ
[ 給料 ]

[x] 今月使えるお金に含める

[追加する]


5月の収入

給料
250,000円
使えるお金に含める

夏ボーナス
300,000円
使えるお金に含めない
```

### 残額計算への反映

`included_in_balance = true` の収入のみ、今月残り使える金額に含める。

`included_in_balance = false` の収入は、年間収支や実収支には含めるが、今月残り使える金額には含めない。

---

## 固定費画面仕様

### 目的

毎月発生する固定費を登録・編集・削除できるようにする。

### 入力項目

| 項目 | 必須 | 内容 |
|---|---|---|
| 名前 | 必須 | 家賃、通信費、サブスクなど |
| 金額 | 必須 | 固定費金額 |
| 開始月 | 必須 | この月以降の計算に含める |
| 有効フラグ | 必須 | 固定費として有効かどうか |

### 画面イメージ

```txt
固定費を追加

名前
[ 家賃 ]

金額
[ 80000 ]

開始月
[ 2026-05 ]

[x] 有効

[追加する]


固定費一覧

家賃
80,000円
2026年5月から有効

通信費
5,000円
2026年5月から有効
```

### 固定費の反映ルール

固定費は、対象月が `start_month` 以降の場合に計算へ含める。

また、`is_active = true` の固定費のみ計算に含める。

例：

```txt
ジム 8,000円
start_month = 2026-06-01
```

この場合、

```txt
2026年5月:
  固定費に含めない

2026年6月以降:
  固定費に含める
```

---

## カレンダー画面仕様

### 目的

月ごとの日別出費と、その日終了時点の残額を確認できるようにする。

### 表示内容

カレンダーの各日には以下を表示する。

- 日付
- その日の出費合計
- その日終了時点の残額

### 画面イメージ

```txt
2026年5月

1
¥2,140
残 ¥38,420

2
¥800
残 ¥37,620

3
¥0
残 ¥37,620
```

### 日別残額の計算

```txt
その日終了時点の残額
= 今月の使える収入合計
- 今月の固定費合計
- 月初からその日までの出費合計
```

### 日付タップ時の仕様

日付をタップすると、その日の出費明細を表示する。

```txt
5月1日の出費

- 780円
- 1,200円
- 160円

この日の出費合計
2,140円

この日終了時点の残額
38,420円
```

明細から出費を削除できる。

---

## 年間サマリー画面仕様

### 目的

一年単位で収入、固定費、出費、収支を確認できるようにする。

### 表示内容

年間サマリーでは以下を表示する。

- 年間全収入
- 年間使える収入
- 年間貯める収入
- 年間固定費
- 年間出費
- 年間実収支
- 年間生活費残り
- 月別サマリー一覧

### 用語定義

```txt
年間全収入
= その年に登録された全収入

年間使える収入
= included_in_balance = true の収入合計

年間貯める収入
= included_in_balance = false の収入合計

年間固定費
= 各月の対象固定費合計の年間合計

年間出費
= その年に登録された出費合計

年間実収支
= 年間全収入 - 年間固定費 - 年間出費

年間生活費残り
= 年間使える収入 - 年間固定費 - 年間出費
```

### 画面イメージ

```txt
2026年の収支

実際の収支
+2,160,000円

貯める収入
1,200,000円

生活費として使える収入
3,600,000円

固定費
1,440,000円

出費
1,200,000円

生活費の残り
960,000円


月別

1月
実収支 +180,000円
生活費残り 80,000円

2月
実収支 +170,000円
生活費残り 70,000円

6月
実収支 +680,000円
生活費残り 80,000円
```

---

## DB設計

### users

Supabase Authのユーザーとアプリ側ユーザーを紐づける。

| カラム | 型 | 内容 |
|---|---|---|
| id | uuid | アプリ内ユーザーID |
| auth_provider_user_id | string | Supabase AuthのユーザーID |
| email | string | メールアドレス |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### incomes

収入を管理する。

| カラム | 型 | 内容 |
|---|---|---|
| id | uuid | 収入ID |
| user_id | uuid | ユーザーID |
| amount | integer | 金額 |
| income_date | date | 収入日 |
| memo | string nullable | メモ |
| included_in_balance | boolean | 今月使える金額に含めるか |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### fixed_costs

固定費を管理する。

| カラム | 型 | 内容 |
|---|---|---|
| id | uuid | 固定費ID |
| user_id | uuid | ユーザーID |
| name | string | 固定費名 |
| amount | integer | 金額 |
| start_month | date | 反映開始月 |
| is_active | boolean | 有効かどうか |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### expenses

出費を管理する。

| カラム | 型 | 内容 |
|---|---|---|
| id | uuid | 出費ID |
| user_id | uuid | ユーザーID |
| amount | integer | 金額 |
| spent_at | timestamp | 出費日時 |
| memo | string nullable | メモ |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

---

## API設計

### 認証

すべてのAPIは認証必須とする。

```txt
Authorization: Bearer <access_token>
```

### 出費API

#### 出費登録

```txt
POST /api/expenses
```

Request:

```json
{
  "amount": 780
}
```

Response:

```json
{
  "expense": {
    "id": "uuid",
    "amount": 780,
    "spentAt": "2026-05-01T10:30:00+09:00"
  },
  "summary": {
    "month": "2026-05",
    "availableIncome": 250000,
    "fixedCostTotal": 120000,
    "expenseTotal": 91580,
    "remainingAmount": 38420
  }
}
```

#### 月別出費取得

```txt
GET /api/expenses?month=2026-05
```

#### 日別出費取得

```txt
GET /api/expenses?date=2026-05-01
```

#### 出費削除

```txt
DELETE /api/expenses/:id
```

### 収入API

#### 収入登録

```txt
POST /api/incomes
```

Request:

```json
{
  "amount": 250000,
  "incomeDate": "2026-05-25",
  "memo": "給料",
  "includedInBalance": true
}
```

#### 月別収入取得

```txt
GET /api/incomes?month=2026-05
```

#### 収入更新

```txt
PUT /api/incomes/:id
```

#### 収入削除

```txt
DELETE /api/incomes/:id
```

### 固定費API

#### 固定費登録

```txt
POST /api/fixed-costs
```

Request:

```json
{
  "name": "家賃",
  "amount": 80000,
  "startMonth": "2026-05-01",
  "isActive": true
}
```

#### 対象月の固定費取得

```txt
GET /api/fixed-costs?month=2026-05
```

#### 固定費更新

```txt
PUT /api/fixed-costs/:id
```

#### 固定費削除

```txt
DELETE /api/fixed-costs/:id
```

### 月次サマリーAPI

```txt
GET /api/monthly-summary?month=2026-05
```

Response:

```json
{
  "month": "2026-05",
  "totalIncome": 550000,
  "availableIncome": 250000,
  "reservedIncome": 300000,
  "fixedCostTotal": 95000,
  "expenseTotal": 50000,
  "remainingAmount": 105000,
  "actualBalance": 405000
}
```

### カレンダーAPI

```txt
GET /api/expense-calendar?month=2026-05
```

Response:

```json
{
  "month": "2026-05",
  "availableIncome": 250000,
  "fixedCostTotal": 95000,
  "days": [
    {
      "date": "2026-05-01",
      "expenseTotal": 2140,
      "remainingAmount": 152860
    },
    {
      "date": "2026-05-02",
      "expenseTotal": 800,
      "remainingAmount": 152060
    }
  ]
}
```

### 年間サマリーAPI

```txt
GET /api/annual-summary?year=2026
```

Response:

```json
{
  "year": 2026,
  "totalIncome": 4800000,
  "availableIncome": 3600000,
  "reservedIncome": 1200000,
  "fixedCostTotal": 1440000,
  "expenseTotal": 1200000,
  "actualBalance": 2160000,
  "availableBalance": 960000,
  "months": [
    {
      "month": "2026-01",
      "totalIncome": 300000,
      "availableIncome": 300000,
      "reservedIncome": 0,
      "fixedCostTotal": 120000,
      "expenseTotal": 100000,
      "actualBalance": 80000,
      "availableBalance": 80000
    }
  ]
}
```

---

## フロントエンド ディレクトリ構成案

```txt
frontend/
  src/
    app/
      login/
        page.tsx
      page.tsx
      incomes/
        page.tsx
      fixed-costs/
        page.tsx
      calendar/
        page.tsx
      annual-summary/
        page.tsx

    domains/
      auth/
        user.ts
      expense/
        expense.ts
      income/
        income.ts
      fixedCost/
        fixedCost.ts
      monthlySummary/
        monthlySummary.ts
      expenseCalendar/
        expenseCalendar.ts
      annualSummary/
        annualSummary.ts

    features/
      auth/
        api/
        components/
        hooks/
        usecases/

      expense/
        api/
          expenseApi.ts
        components/
          ExpenseAmountInput.tsx
          TodayExpenseList.tsx
        hooks/
          useCreateExpenseOnBlur.ts
          useTodayExpenses.ts
          useUndoExpense.ts
        usecases/
          createExpenseUsecase.ts
          deleteExpenseUsecase.ts
          getTodayExpensesUsecase.ts

      income/
        api/
        components/
        hooks/
        usecases/

      fixedCost/
        api/
        components/
        hooks/
        usecases/

      monthlySummary/
        api/
        components/
        hooks/
        usecases/

      expenseCalendar/
        api/
        components/
        hooks/
        usecases/

      annualSummary/
        api/
        components/
        hooks/
        usecases/

    components/
      atoms/
        AppButton.tsx
        AppTextField.tsx
        AmountText.tsx

      molecules/
        AmountInputField.tsx
        SummaryItem.tsx

      organisms/
        AppHeader.tsx
        BottomNavigation.tsx

    libs/
      apiClient.ts
      supabaseClient.ts
      date.ts
      money.ts
```

---

## バックエンド ディレクトリ構成案

```txt
backend/
  cmd/
    api/
      main.go

  internal/
    domain/
      model/
        user.go
        expense.go
        income.go
        fixed_cost.go
      repository/
        expense_repository.go
        income_repository.go
        fixed_cost_repository.go
        user_repository.go

    usecase/
      expense/
        create_expense.go
        delete_expense.go
        list_expenses_by_date.go
        list_expenses_by_month.go

      income/
        create_income.go
        update_income.go
        delete_income.go
        list_incomes_by_month.go

      fixedcost/
        create_fixed_cost.go
        update_fixed_cost.go
        delete_fixed_cost.go
        list_fixed_costs_by_month.go

      monthlysummary/
        get_monthly_summary.go

      expensecalendar/
        get_expense_calendar.go

      annualsummary/
        get_annual_summary.go

    infrastructure/
      db/
        gorm.go
      persistence/
        expense_repository.go
        income_repository.go
        fixed_cost_repository.go
        user_repository.go

    interface/
      handler/
        expense_handler.go
        income_handler.go
        fixed_cost_handler.go
        monthly_summary_handler.go
        expense_calendar_handler.go
        annual_summary_handler.go

      middleware/
        auth_middleware.go

      router/
        router.go
```

---

## ルートディレクトリ構成案

```txt
kakeibo-app/
  docs/
    spec.md

  frontend/
    src/

  backend/
    cmd/
    internal/

  README.md
  .gitignore
```

---

## 実装順序

### Step 1: リポジトリ作成

- frontend
- backend
- README
- docs/spec.md

### Step 2: DB設計

- users
- incomes
- fixed_costs
- expenses

### Step 3: Go APIの土台作成

- Echo導入
- GORM導入
- DB接続
- ルーティング作成
- ヘルスチェックAPI作成

### Step 4: 認証なしでAPI実装

最初はローカル開発用に固定の `user_id` を使う。

- 出費API
- 収入API
- 固定費API
- 月次サマリーAPI
- カレンダーAPI
- 年間サマリーAPI

### Step 5: Next.jsの画面モック作成

- ログイン画面
- トップ画面
- 収入画面
- 固定費画面
- カレンダー画面
- 年間サマリー画面
- Web App Manifestとスマホホーム画面追加用のアイコン設定

### Step 6: フロントとAPI接続

- 出費登録
- Undo
- 今日の出費取得
- 月次サマリー取得
- 収入CRUD
- 固定費CRUD
- カレンダー表示
- 年間サマリー表示

### Step 7: Supabase Auth連携

- ログイン
- ログアウト
- アクセストークン取得
- Go APIへトークン送信
- Go API側でトークン検証
- user_id紐づけ

### Step 8: デプロイ

- FrontendをVercelへデプロイ
- BackendをRender/Fly.io/Railwayへデプロイ
- DB/AuthはSupabaseを利用

---

## MVP完了条件

以下を満たしたらMVP完了とする。

- ログインできる
- 未ログインではアプリ画面を見られない
- 出費をトップ画面から金額のみで登録できる
- フォーカスアウトで出費登録される
- 出費登録後に3秒間Undoできる
- 今日の出費一覧が表示される
- 今月残り使える金額が表示される
- 収入を複数登録できる
- 収入ごとに「今月使えるお金に含める」を設定できる
- 固定費を登録できる
- 固定費が開始月以降の計算に反映される
- カレンダーで日別出費と日別残額が見られる
- 年間サマリーで年間収支が見られる
- 自分のデータだけが表示・更新される
- スマホのホーム画面に追加してアプリのように起動できる

---

## 将来追加したい機能

- 出費メモ編集
- 過去日への出費登録
- 月切り替えUI改善
- グラフ表示
- PWA対応
- Service Workerによるオフライン対応
- AWS移行
- 固定費の終了月設定
- 収入のテンプレート化
- 月ごとの目標貯金額
# 家計簿アプリ MVP仕様書

## アプリ概要

本アプリは、自分だけが利用する個人向け家計管理アプリである。

一般的な家計簿アプリのように細かいカテゴリ分析を目的とするのではなく、「今月あといくら使えるか」を最短で把握することを主目的とする。

出費入力の手間を極力減らし、トップ画面から金額だけをすばやく登録できるようにする。

---

## MVPの目的

### 目的

- 今月残り使える金額をすぐ確認できる
- 出費を最短導線で登録できる
- 収入、固定費、出費をもとに残額を自動計算できる
- カレンダーで日別の出費と残額を確認できる
- 年間の収支をざっくり確認できる
- ログインした本人だけが利用できる
- スマホのホーム画面からアプリのように起動できる

### やらないこと

MVPでは以下は対応しない。

- 出費カテゴリ管理
- レシート画像保存
- 複数ユーザーでの共有
- 予算カテゴリ別管理
- 銀行口座連携
- クレジットカード連携
- CSVインポート
- CSVエクスポート
- 通知機能
- 新規ユーザー登録画面
- Service Workerによるオフライン対応

---

## 基本方針

### アプリの思想

このアプリでは「何に使ったか」よりも「あといくら使えるか」を重視する。

そのため、出費にはカテゴリを持たせない。

ユーザーが最も頻繁に行う操作は出費入力であるため、トップ画面で金額だけを入力できるようにする。

### 残額計算

今月残り使える金額は以下で計算する。

```txt
今月残り使える金額
= 今月の使える収入合計
- 今月の固定費合計
- 今月の出費合計
```

### 収入の扱い

収入は複数登録できる。

ただし、ボーナスや貯金したい臨時収入などは、「収入として記録するが、今月使える金額には含めない」ことができる。

そのため、収入には `included_in_balance` フラグを持たせる。

```txt
true:
  今月使える金額に含める

false:
  収入として記録するが、今月使える金額には含めない
```

---

## 画面一覧

| パス | 画面名 | 概要 |
|---|---|---|
| `/login` | ログイン画面 | メールアドレスとパスワードでログインする |
| `/` | トップ画面 | 今月残り使える金額の確認と出費入力を行う |
| `/incomes` | 収入画面 | 収入を登録・編集・削除する |
| `/fixed-costs` | 固定費画面 | 固定費を登録・編集・削除する |
| `/calendar` | カレンダー画面 | 日別の出費と日別残額を見る |
| `/annual-summary` | 年間サマリー画面 | 年間収支を見る |

---

## 各画面の概要

### ログイン画面

- メールアドレスとパスワードでログインする
- 新規登録画面は作らない
- ユーザーはSupabase Auth側で事前作成する

### トップ画面

トップ画面では、今月残り使える金額を確認し、出費をすばやく登録できるようにする。

```txt
今月残り使える金額
38,420円

[ 使った金額を入力 ]

780円を登録しました  [取り消す]

今日の出費
- 780円
- 1,200円
- 160円

今月の内訳
使える収入  250,000円
固定費      120,000円
出費         91,580円
```

出費入力欄に金額を入力し、フォーカスアウトしたタイミングで出費を登録する。

登録成功後は入力欄をクリアし、3秒間Undoを表示する。

### 収入画面

収入を複数登録できる。

収入ごとに「今月使えるお金に含める」を設定できる。

ボーナスや貯金したい臨時収入は、収入として記録しつつ、今月残り使える金額の計算から除外できる。

### 固定費画面

毎月発生する固定費を登録できる。

固定費には開始月を持たせ、開始月以降の月次計算に反映する。

### カレンダー画面

カレンダーの各日には以下を表示する。

- 日付
- その日の出費合計
- その日終了時点の残額

日付をタップすると、その日の出費明細を表示する。

### 年間サマリー画面

一年単位で以下を確認できる。

- 年間全収入
- 年間使える収入
- 年間貯める収入
- 年間固定費
- 年間出費
- 年間実収支
- 年間生活費残り
- 月別サマリー一覧

---

## 認証方針

- Supabase Authを利用する
- 新規登録画面は作らない
- Supabase側でユーザーを事前作成する
- 未ログイン状態ではアプリ画面を表示しない
- 未ログインの場合は `/login` にリダイレクトする
- APIはすべて認証必須とする
- APIでは必ずログインユーザー本人のデータのみ取得・更新する

---

## 技術スタック概要

### フロントエンド

- Next.js
- TypeScript
- MUI
- Atomic Design寄りのコンポーネント設計
- features / usecases / domains を意識した構成

詳細は [フロントエンド仕様](../front-end/spec.md) を参照する。

### バックエンド

- Go
- Echo
- GORM
- オニオンアーキテクチャ

詳細は [バックエンド仕様](../back-end/spec.md) を参照する。

### DB

- PostgreSQL
- Supabase PostgreSQLを想定

詳細は [DB仕様](../db/spec.md) を参照する。

### インフラ

MVPでは最小構成を優先する。

```txt
Frontend:
  Vercel

Backend:
  Render / Fly.io / Railway など

Auth:
  Supabase Auth

DB:
  Supabase PostgreSQL
```

AWS構成はMVP完成後に検討する。

---

## ルートディレクトリ構成

```txt
kakeibo-app/
  docs/
    spec.md
    frontend-spec.md
    backend-spec.md
    db-spec.md

  frontend/
    src/

  backend/
    cmd/
    internal/

  README.md
  .gitignore
```

---

## 実装順序

### Step 1: リポジトリ作成

- frontend
- backend
- README
- docs/spec.md
- docs/frontend-spec.md
- docs/backend-spec.md
- docs/db-spec.md

### Step 2: DB設計

- users
- incomes
- fixed_costs
- expenses

### Step 3: Go APIの土台作成

- Echo導入
- GORM導入
- DB接続
- ルーティング作成
- ヘルスチェックAPI作成

### Step 4: 認証なしでAPI実装

最初はローカル開発用に固定の `user_id` を使う。

- 出費API
- 収入API
- 固定費API
- 月次サマリーAPI
- カレンダーAPI
- 年間サマリーAPI

### Step 5: Next.jsの画面モック作成

- ログイン画面
- トップ画面
- 収入画面
- 固定費画面
- カレンダー画面
- 年間サマリー画面
- Web App Manifestとスマホホーム画面追加用のアイコン設定

### Step 6: フロントとAPI接続

- 出費登録
- Undo
- 今日の出費取得
- 月次サマリー取得
- 収入CRUD
- 固定費CRUD
- カレンダー表示
- 年間サマリー表示

### Step 7: Supabase Auth連携

- ログイン
- ログアウト
- アクセストークン取得
- Go APIへトークン送信
- Go API側でトークン検証
- user_id紐づけ

### Step 8: デプロイ

- FrontendをVercelへデプロイ
- BackendをRender/Fly.io/Railwayへデプロイ
- DB/AuthはSupabaseを利用

---

## MVP完了条件

以下を満たしたらMVP完了とする。

- ログインできる
- 未ログインではアプリ画面を見られない
- 出費をトップ画面から金額のみで登録できる
- フォーカスアウトで出費登録される
- 出費登録後に3秒間Undoできる
- 今日の出費一覧が表示される
- 今月残り使える金額が表示される
- 収入を複数登録できる
- 収入ごとに「今月使えるお金に含める」を設定できる
- 固定費を登録できる
- 固定費が開始月以降の計算に反映される
- カレンダーで日別出費と日別残額が見られる
- 年間サマリーで年間収支が見られる
- 自分のデータだけが表示・更新される
- スマホのホーム画面に追加してアプリのように起動できる

---

## 将来追加したい機能

- 出費メモ編集
- 過去日への出費登録
- 月切り替えUI改善
- グラフ表示
- PWA対応
- Service Workerによるオフライン対応
- AWS移行
- 固定費の終了月設定
- 収入のテンプレート化
- 月ごとの目標貯金額

---

## 関連ドキュメント

詳細仕様は以下を参照する。

- [フロントエンド仕様](../front-end/spec.md)
- [バックエンド仕様](../back-end/spec.md)
- [DB仕様](../db/spec.md)
