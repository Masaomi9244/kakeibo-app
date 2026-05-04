# Frontend Architecture

## 技術スタック

- Next.js
- TypeScript
- MUI
- Supabase Auth Client
- TanStack Query
- ESLint / Prettier
- Atomic Design寄りのコンポーネント設計
- features / usecases / domains を意識した構成

---

## 基本方針

フロントエンドは、画面表示、入力、API呼び出し、最低限の入力バリデーションを担当する。

残額計算、固定費の対象月判定、日別集計、年間集計などの業務ロジックはGo API側で行う。

### 担当すること

- 画面表示
- ユーザー入力
- 入力値の簡易バリデーション
- API呼び出し
- ログイン状態の管理
- 未ログイン時の画面ガード
- 出費登録後のUndo表示
- 金額や日付の表示整形
- スマホホーム画面追加用の設定

### 担当しないこと

- 残額の正計算
- 固定費の対象月判定
- 日別残額の正計算
- 年間収支の正計算
- API側の認可判定
- DBへの直接アクセス

---

## Next.js App Router

Next.js App Routerを使用する。

ルーティングは `src/app` 配下に定義する。

`page.tsx` は、画面全体のレイアウトとfeature componentの配置を中心にする。

複雑な入力処理やAPI呼び出しの詳細は `features/` 配下に寄せる。

---

## Server Component / Client Component

基本方針は以下とする。

- `page.tsx` は画面の骨組みを担当する
- 入力フォームや状態を持つUIはClient Componentにする
- hooksを利用するコンポーネントはClient Componentにする
- Supabase Auth Clientを直接利用する箇所はClient Componentにする
- 何でも `use client` にせず、必要なコンポーネントだけClient Componentにする

---

## Provider設定

アプリ全体で利用するProviderは、ルートレイアウトまたは専用Providerコンポーネントに集約する。

MVPで必要なProviderは以下とする。

- MUI Theme Provider
- TanStack Query Provider
- 必要に応じたAuth Session Provider

Client Componentが必要なProviderは `src/app/providers.tsx` などに切り出し、`layout.tsx` から呼び出す。

---

## ディレクトリ構成

```txt
front-end/
  src/
    app/
    domains/
    features/
    components/
    libs/
    theme/
    middleware.ts
```

### `app/`

Next.js App Routerのルーティングを配置する。

### `domains/`

アプリ内で中心的に使う型を配置する。

### `features/`

機能単位の実装を配置する。

### `components/`

複数featureで利用する汎用UIを置く。

### `libs/`

外部ライブラリ設定や共通関数を置く。

### `theme/`

MUI themeを配置する。

---

## 状態管理

### サーバー状態

APIから取得するデータはTanStack Queryで管理する。

対象例：

- 月次サマリー
- 今日の出費一覧
- 収入一覧
- 固定費一覧
- カレンダー
- 年間サマリー

### フォーム状態

フォーム入力中の値はReact stateで管理する。

### グローバル状態

MVPでは大きなグローバル状態管理ライブラリは導入しない。

---

## UI方針

- スマホ利用を主に想定する
- トップ画面の出費登録導線を最優先する
- Bottom Navigationで主要画面へ移動できるようにする
- ローディング、空状態、エラー状態を用意する

---

## MUIテーマ

MUI themeを利用する。

色、余白、角丸、Typographyなどはthemeで管理する。

アプリ全体で見た目や挙動を統一したいものは `components/atoms` にラッパーを作る。

複数featureで使う共通UIはAtomic Design寄りに分類する。

- `components/atoms/`: 最小UI
- `components/molecules/`: 小さな組み合わせUI
- `components/organisms/`: 大きめの共通UI

feature固有の画面部品は `features/{feature}/components/` に置く。

---

## API接続

API通信は共通API Client経由で行う。

API URLは `NEXT_PUBLIC_API_BASE_URL` から取得する。

APIエラーはバックエンドのエラーレスポンス形式に合わせる。

domain型、API DTO、mapper、TanStack Query hooks、query keyの詳細は `front-end-domain-api-hooks.md` に置く。

```ts
export type ApiErrorResponse = {
  message: string;
  details?: {
    field?: string;
    message: string;
  }[];
};
```

---

## 表示フォーマット

### 金額

金額はカンマ区切りで表示する。

```txt
38420 -> 38,420円
```

### 日付

日付表示はAsia/Tokyo基準とする。

```txt
2026-05-01
```

---

## アクセシビリティ

- 入力欄にはlabelを付ける
- エラーはテキストで表示する
- ボタンは意味が分かる文言にする
- 色だけで状態を表現しない
- スマホで操作しやすいタップ領域を確保する

---

## テスト方針

MVPでは最低限、以下をテストする。

- 金額フォーマット関数
- 日付フォーマット関数
- 出費入力のバリデーション
- 金額正規化処理
- API Clientのエラー処理
- TanStack Queryのquery key生成関数
- Enter保存とblur保存の二重登録防止
- Undo対象が最新1件に置き換わること

---

## 環境変数

フロントエンドで利用する環境変数は以下とする。

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_APP_ENV
```
