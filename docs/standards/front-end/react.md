# Frontend React Standards

React component、hooks、Next.js App Routerに関する規約です。

---

## React / Component規約

### コンポーネントの責務

ReactコンポーネントはUI表示を主責務とする。

以下を1つのコンポーネントに詰め込まない。

- API通信
- 入力値の正規化
- 複雑な状態管理
- domain変換
- 複数画面にまたがるロジック

Reactコンポーネントは `components/` 配下にのみ置く。
`features/` 配下にReactコンポーネントを作成することは禁止する。
`features/` は hooks、api、mapper、usecase、feature固有domain型に限定する。

### コンポーネント命名

コンポーネント名はPascalCaseとする。

良い例：

```txt
ExpenseAmountInput
TodayExpenseList
MonthlySummaryCard
```

悪い例：

```txt
expenseInput
List
CardComponent
```

### props

propsは必要最小限にする。

propsが多くなりすぎる場合は、責務分割を検討する。

props型は明示する。

```tsx
export type ExpenseAmountInputProps = {
  /** 入力欄を操作不可にするか */
  disabled?: boolean;
  /** 出費金額送信時に呼び出す処理 */
  onSubmit: (amount: number) => void;
};
```

### default export

原則としてdefault exportは禁止する。

名前付きexportを使用する。

例外として、Next.js App Routerの `page.tsx`、`layout.tsx`、`providers.tsx` はdefault exportを許可する。

### `use client`

`use client` は必要なファイルにのみ付与する。

対象例：

- hooksを利用するコンポーネント
- 入力状態を持つコンポーネント
- Supabase Clientを直接利用するコンポーネント
- TanStack Queryを利用するコンポーネント

全ファイルに機械的に `use client` を付けない。

### コンポーネント分割基準

以下に該当する場合は、コンポーネント分割を検討する。

- JSXが長くなり、画面構造が読みづらい
- propsが8個以上になる
- useState / useEffect / useMemo / useCallback が増えすぎている
- UI表示とイベント制御が混ざっている
- 1つのコンポーネントに複数の表示責務がある

以下に該当する場合は、検討ではなく分割する。

- 1ファイルに複数のReactコンポーネントがある
- propsが10個以上ある
- `useState` が5個以上ある
- `useEffect` が3個以上ある
- 1コンポーネントが200行を超える
- JSX内に3段階以上のネストした三項演算子がある
- API DTOのproperty名がJSX内に直接出てくる
- 同じ表示ブロックが2回以上コピーされている

分割後も、親コンポーネントが単なるprops中継だけになりすぎる場合は、hookまたはcontainer componentの責務を見直す。

### useEffectの扱い

`useEffect` は必要最小限にする。

以下の用途で安易に使わない。

- API取得
- propsからstateを同期するだけの処理
- 計算可能な値の再計算

API取得はTanStack Queryを使う。

propsやstateから計算できる値は、まず通常の変数または `useMemo` を検討する。

### useMemo / useCallbackの扱い

`useMemo` / `useCallback` は乱用しない。

以下の場合に限定して利用する。

- 高コストな計算を避けたい場合
- memo化された子コンポーネントへ関数を渡す場合
- 依存配列を明確に管理できる場合

パフォーマンス理由がない場合は、読みやすさを優先する。

### Container / Presentationalの分離

API取得、mutation、Snackbar、Undo、フォーム送信制御を持つcomponentは、表示専用componentと分ける。
これらの制御は `features/*/hooks` のpage view model hookへ寄せる。

推奨する分け方：

```txt
components/templates/HomePageContent/HomePageContent.tsx
components/organisms/QuickExpenseInput/QuickExpenseInput.tsx
features/home/hooks/useHomePageViewModel.ts
features/home/hooks/useQuickExpenseInput.ts
```

organismは表示とユーザー操作のprops受け取りに寄せる。
TanStack Query、API DTO、Supabase Clientを直接importしない。
templateは画面単位の接続役としてpage view model hookを呼び出し、organismへpropsを渡す。
templateに保存可否判断、request組み立て、mutation呼び出し、Snackbar / Undo制御を書かない。

### JSX内ロジック

JSX内には複雑な処理を書かない。

禁止する例：

- JSX内でDTOからdomain型へ変換する
- JSX内で金額や日付の正規化を行う
- JSX内で3条件以上の複雑な表示条件を直接書く
- `map` の中で副作用を起こす

表示用に整形した値は、component本体の上部、hook、usecase、formatterのいずれかで名前を付ける。

---

## hooks規約

### hookの責務

hooksはReactの状態管理や画面都合の処理を担当する。

例：

- `useCreateExpenseOnBlur`
- `useUndoExpense`
- `useTodayExpenses`
- `useMonthlySummary`

### hook命名

hook名は必ず `use` から始める。

### hookに書いてよい処理

- React state管理
- TanStack Queryのquery / mutation
- イベントハンドラの組み立て
- SnackbarやUndoなどのUI状態制御

### hookに書きすぎない処理

以下はusecaseやlibへ分離する。

- 金額正規化
- DTOからdomain型への変換
- 複雑な条件分岐
- 汎用フォーマット処理

### hookの戻り値

custom hookの戻り値は、呼び出し側が迷わない名前にする。

以下は禁止する。

- 配列tupleで複数の値を返すこと。ただしReact標準hook風の明確な理由がある場合を除く
- `data`、`state`、`handlers` だけの曖昧な名前で返すこと
- API DTOをそのままUI componentへ返すこと

推奨例：

```ts
export type UseExpenseAmountInputReturn = {
  /** 入力中の金額文字列 */
  inputValue: string;
  /** 入力欄に表示するエラー文言 */
  errorMessage: string | null;
  /** 登録中か */
  isSubmitting: boolean;
  /** 金額入力変更時に呼び出す処理 */
  handleChange: (value: string) => void;
  /** フォーカスアウト時に呼び出す処理 */
  handleBlur: () => void;
  /** Enterキー押下時に呼び出す処理 */
  handleEnter: () => void;
};
```

hookが返す関数は、UIイベントに近い場合は `handle`、業務操作に近い場合は `submit` / `create` / `update` / `delete` など、責務が分かる動詞を使う。

### hookの依存

hookから直接参照してよいものは以下に限定する。

- React hooks
- TanStack Query
- feature内のapi / usecase / mapper
- `domains/`
- `libs/`

hookからMUI component、`page.tsx`、他featureのcomponentをimportしない。

---

## Next.js App Router規約

### page.tsx

`page.tsx` は薄く保つ。

主に以下を行う。

- ページ全体のレイアウト
- template componentの配置
- 最低限のmetadata設定

### layout.tsx

`layout.tsx` は全体レイアウトとProvider呼び出しを担当する。

Client Componentが必要なProviderは `providers.tsx` に切り出す。

### middleware.ts

`middleware.ts` は画面遷移上の認証ガードを担当する。

ただし、最終的な認可はGo API側で行う。

フロントエンドのmiddlewareだけを信用しない。

---
