# Implementation Task Breakdown

## 目的

2026-05-05時点のFigma Make修正版スクリーンショットを前提に、実装タスクを着手順、依存関係、完了条件に分けて整理する。

このファイルは実装順序の判断材料であり、画面仕様の正は `docs/features/*.md`、API契約の正は `docs/api/*.md`、コンポーネント配置の正は `docs/design/component-breakdown.md` とする。

## 先に進めてよいこと

最終スクリーンショットの細部に強く依存しないため、先に進めてよい。

- App Routerのルート構成
- Provider構成
- 認証ガード
- domain型
- API DTO型
- mapper
- API client呼び出し関数
- TanStack Query hooks
- query key factory
- 金額format
- 日付format
- Asia/Tokyo基準の今日・対象月処理
- 入力値正規化usecase
- 保存、削除、Undoの状態制御
- テスト方針と最低限のunit test

## スクリーンショットに寄せること

見た目の詰めが必要なため、2026-05-05時点の修正版スクリーンショットを基準に調整する。

- 余白
- Typographyの細かいサイズ
- カードの視覚階層
- スマホ幅のファーストビュー内配置
- PC幅のカラム幅
- カレンダーセル内の情報密度
- 年間サマリーのグラフ見た目

## 着手順

### App基盤

目的:

- 以降のfeatureを載せるための土台を作る。

主な作業:

- `app/layout.tsx` のProvider適用
- `app/providers.tsx` の責務整理
- MUI Theme Provider
- TanStack Query Provider
- Supabase Auth Clientの利用場所整理
- ログイン後画面の共通レイアウト接続

完了条件:

- Providerが1か所に集約されている
- 各pageがfeature componentを呼ぶだけに近い
- `use client` が必要なファイルだけに付いている
- 未ログイン時にアプリ画面を表示しない方針が決まっている

### Domain / DTO / Mapper基盤

目的:

- API DTOと画面で使うdomain型を分離し、UI実装時にDTOへ依存しないようにする。

主な作業:

- `domains/` にdomain型を定義する
- `features/*/api/` にrequest / response DTO型を定義する
- `features/*/mappers/` にDTOからdomain型への変換を置く
- 金額、日付、月文字列の共通型エイリアスを検討する

完了条件:

- componentがAPI DTOを直接importしない
- hookがUIに返す値はdomain型またはview modelになっている
- mapperの責務がAPI関数やcomponentへ漏れていない

詳細:

- `docs/architecture/front-end-domain-api-hooks.md`

### API Client / Query基盤

目的:

- API呼び出し、認証ヘッダー、query key、cache invalidationを実装前に固定する。

主な作業:

- 共通API clientの利用ルール確認
- access token付与方針の確認
- query key factory作成
- query hooks作成
- mutation hooks作成
- mutation後のinvalidate対象整理

完了条件:

- query keyをcomponentへ直書きしていない
- mutation成功時に関連画面のキャッシュを更新または無効化できる
- APIエラーをUIが表示できる形に変換できる

詳細:

- `docs/architecture/front-end-domain-api-hooks.md`

### 共通UI

目的:

- Figma確定後に見た目を調整できるよう、Atomic Design寄りの共通UIの境界を先に作る。

主な作業:

- `components/atoms/`
- `components/molecules/`
- `components/organisms/`
- `AppShell`
- `AppSideNav`
- `AppBottomNav`
- `UserMenu`
- `StatCard`
- `PageHeader`
- `EmptyState`
- `ErrorMessage`
- `LoadingState`

完了条件:

- 共通UIにfeature固有の業務ロジックがない
- `components/` 配下からTanStack Queryを直接使っていない
- feature固有UIを早すぎる段階で共通化していない

### Auth

目的:

- ログイン、ログアウト、未ログインガードを先に通す。

主な作業:

- `/login`
- ログインフォーム
- ログイン済みなら `/` へ遷移
- 未ログインなら `/login` へ遷移
- APIリクエスト時のaccess token付与
- ログアウト導線

完了条件:

- 新規登録導線がない
- SNSログインがない
- デモ用ログイン文言がない
- ログアウト後にアプリ画面を表示しない

参照:

- `docs/features/auth.md`
- `docs/api/common.md`

### Home

目的:

- MVP価値の中心である「今月あといくら使えるか」と「金額だけの出費登録」を実装する。

主な作業:

- 月次サマリー取得
- 今日の出費取得
- 金額のみの出費登録
- blur / Enter保存
- 二重登録防止
- 保存失敗時の入力値維持
- Undo Snackbar
- Undoによる出費削除
- 月次サマリーと今日の出費一覧の更新

完了条件:

- カテゴリ入力がない
- メモ入力がない
- 登録ボタンがない
- `すべて見る` 導線がない
- 今日の出費一覧にカテゴリ表示がない
- Undo対象は最後の出費1件だけ

参照:

- `docs/features/home.md`
- `docs/api/expenses.md`
- `docs/api/monthly-summary.md`

### Incomes

目的:

- 収入の登録、編集、削除と `includedInBalance` を扱えるようにする。

主な作業:

- 月別収入一覧
- 収入登録
- 収入編集
- 収入削除
- `includedInBalance` の切り替え
- mutation後の月次サマリー更新

完了条件:

- 収入カテゴリがない
- `includedInBalance` の意味がUI上で分かる
- 年間実収支には全収入が含まれる前提を崩していない

参照:

- `docs/features/incomes.md`
- `docs/api/incomes.md`

### Fixed Costs

目的:

- 固定費の登録、編集、削除と `isActive` を扱えるようにする。

主な作業:

- 対象月の固定費一覧
- 固定費登録
- 固定費編集
- 固定費削除
- `isActive` の切り替え
- mutation後の月次サマリー更新

完了条件:

- 終了月がない
- 固定費カテゴリがない
- 固定費履歴管理を作っていない
- `isActive = false` の過去月影響を将来課題として扱っている

参照:

- `docs/features/fixed-costs.md`
- `docs/api/fixed-costs.md`

### Calendar

目的:

- 日別の出費合計と、その日終了時点の残額を確認できるようにする。

主な作業:

- 対象月のカレンダー取得
- 月移動
- 日付選択
- 選択日の出費明細取得
- 日別出費合計表示
- 日別終了時点残額表示

完了条件:

- カテゴリ別表示がない
- 予算カテゴリ表示がない
- スマホでも日別残額を確認できる
- フロント側で残額の正計算をしていない

参照:

- `docs/features/calendar.md`
- `docs/api/expense-calendar.md`
- `docs/api/expenses.md`

### Annual Summary

目的:

- 年間の収入、固定費、出費、収支をざっくり確認できるようにする。

主な作業:

- 年間サマリー取得
- 年間概要カード
- 月別推移グラフ
- 月別サマリー一覧
- 補助カード

完了条件:

- 出費カテゴリ割合グラフがない
- カテゴリランキングがない
- `総貯蓄` という曖昧な表示がない
- 月別サマリーに必要項目がそろっている

参照:

- `docs/features/annual-summary.md`
- `docs/api/annual-summary.md`

### PWA

目的:

- スマホホーム画面から使いやすい状態にする。

主な作業:

- manifest
- icon
- theme color
- viewport確認
- ホーム画面追加時の表示名

完了条件:

- PWA用の設定画面を作っていない
- スマホでトップ画面の主要操作にすぐ到達できる

参照:

- `docs/features/pwa.md`

## 実装時のガード

以下が混ざったらscope逸脱として止める。

- `/expenses`
- `/settings`
- 出費カテゴリ
- 収入カテゴリ
- 固定費カテゴリ
- 出費メモ
- 出費登録ボタン
- カテゴリ別支出グラフ
- カテゴリランキング
- 新規登録画面
- SNSログイン

## 検証単位

各タスクごとに以下を確認する。

- TypeScript型チェック
- lint
- format
- unit test
- build
- スマホ幅の表示崩れ
- PC幅の表示崩れ
- Loading / Empty / Error / Saving状態

UI実装に入った後は、主要画面ごとにブラウザでスクリーンショット確認を行う。
