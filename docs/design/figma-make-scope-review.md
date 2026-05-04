# Figma Make Scope Review

## 目的

Figma Makeで生成した家計簿アプリ案を、`docs/product/scope.md` に忠実かどうかの観点でレビューする。

このレビューでは、Figma Makeをそのまま実装するのではなく、MVP scopeに合わせて採用・修正・不採用を判断する。

## 読み取り状況

Figma Makeから以下の画面・共通部品が生成されていることを確認した。

### 画面

- `LoginPage`
- `HomePage`
- `ExpensesPage`
- `IncomePage`
- `FixedCostsPage`
- `CalendarPage`
- `AnnualPage`
- `SettingsPage`

### 共通部品

- `MainLayout`
- `BottomNav`
- `SideNav`
- `StatCard`
- `EmptyState`
- `ErrorMessage`
- `LoadingSpinner`

Figma Makeファイルは通常のFigma Designファイルとは扱いが異なり、現時点ではスクリーンショット取得ではなく、Makeが生成したソース構成をもとに確認している。

## Scopeとの一致

`docs/product/scope.md` のMVP画面一覧は以下。

| パス | 画面名 | 判定 |
|---|---|---|
| `/login` | ログイン画面 | Figma Makeに存在するため採用 |
| `/` | トップ画面 | Figma Makeに存在するため採用 |
| `/incomes` | 収入画面 | Figma Makeに存在するため採用 |
| `/fixed-costs` | 固定費画面 | Figma Makeに存在するため採用 |
| `/calendar` | カレンダー画面 | Figma Makeに存在するため採用 |
| `/annual-summary` | 年間サマリー画面 | Figma Makeに存在するため採用 |

## Scopeから外れやすい点

### 支出専用画面

Figma Makeには `ExpensesPage` が存在する。

ただし、MVP scopeでは支出専用画面は定義されていない。
MVPの出費登録はトップ画面から金額のみで行う。

実装方針:

- `/expenses` はMVPでは作らない
- 支出登録フォームはトップ画面に置く
- 今日の出費一覧もトップ画面に置く
- 支出の詳細管理画面が必要になった場合は、MVP後に再検討する

### 出費カテゴリ

Figma Make案または生成プロンプト由来で、出費カテゴリ選択やカテゴリ別表示が含まれている可能性がある。

ただし、MVPでは以下を明確にやらない。

- 出費カテゴリ管理
- 出費のカテゴリ別集計
- 予算カテゴリ別管理

実装方針:

- 出費入力にカテゴリ選択を置かない
- 出費一覧にもカテゴリ列を置かない
- 年間サマリーにカテゴリ割合グラフを置かない
- 「食費」「交通費」などのカテゴリ表現はサンプルデータにも使わない

### 設定画面

Figma Makeには `SettingsPage` が存在する。

ただし、MVP scopeの画面一覧には設定画面はない。
一方で、MVP完了条件にはログアウトが含まれている。

実装方針:

- `/settings` はMVPでは原則作らない
- ログアウト導線はヘッダー、サイドナビ、またはユーザーメニューに最小限で置く
- 表示名変更、メールアドレス変更、アプリ設定などはMVPでは作らない

### 新規登録導線

MVPでは新規ユーザー登録画面を作らない。

実装方針:

- ログイン画面に新規登録リンクを置かない
- 「アカウント作成」ボタンを置かない
- Supabase Auth側で事前作成されたユーザーのログインだけを扱う

### PWA専用画面

MVPではスマホホーム画面対応が必要だが、PWA設定画面は不要。

実装方針:

- Web App Manifest
- theme color
- icon
- apple-touch-icon

上記は実装するが、ユーザー向けのPWA説明画面は作らない。

## 採用する方向性

Figma Make案から採用するもの:

- ログイン、トップ、収入、固定費、カレンダー、年間サマリーの画面構成
- `BottomNav` と `SideNav` によるレスポンシブナビゲーション
- `StatCard` による残額・収入・固定費・出費の整理
- `EmptyState`、`ErrorMessage`、`LoadingSpinner` などの状態表現
- 落ち着いた家計簿アプリらしいトーン

## 補正する方向性

実装前に補正するもの:

- 支出専用画面をトップ画面の最短入力へ統合する
- 出費カテゴリ系UIを削除する
- 設定画面を作らず、ログアウト導線だけを残す
- 年間サマリーからカテゴリ割合グラフを削除する
- ナビゲーションをMVP画面一覧に合わせる

## 結論

Figma Make案は画面の土台としては利用できる。

ただし、そのまま実装すると `docs/product/scope.md` の「やらないこと」に含まれる支出カテゴリ、支出専用画面、設定画面が混ざる可能性が高い。

実装ではFigma Makeを見た目とレイアウトの参考に留め、MVP scopeを正として画面・導線・表示項目を絞る。
