# Frontend Standards

フロントエンド実装規約の入口です。詳細は責務別ファイルを参照します。

---

## 目的

この規約は、家計簿アプリのフロントエンド実装における書き方、設計、責務分離、lint / formatter / test 方針を統一するためのルールである。

フロントエンドでは、以下を特に重視する。

- ファイルごとの書き方のずれを防ぐ
- Reactコンポーネントの肥大化を防ぐ
- API通信、状態管理、UI表示の責務を分ける
- `any` や場当たり的な型定義を避ける
- Next.js App Routerの構成を崩さない
- CodexなどのAIエージェントが一貫した実装を行える状態にする

---

## 参照する仕様書・規約

フロントエンド実装では、以下を必ず参照する。

- `docs/README.md`
- `docs/product/spec.md`
- `docs/product/*.md`
- `docs/features/*.md`
- `docs/architecture/front-end.md`
- `docs/api/*.md`
- `docs/front-end/spec.md`
- `docs/standards/common.md`
- `docs/standards/front-end/index.md`

仕様や規約が矛盾する場合は、実装を進める前に仕様書または規約を修正する。

---

## この規約の読み方

この規約では、実装者とAIエージェントが同じ判断をできるように、以下の意味で用語を使う。

| 表現 | 意味 |
|---|---|
| 必須 | 守らない実装は完了不可 |
| 禁止 | 例外申請なしで使ってはいけない |
| 原則禁止 | 例外申請を同じPRまたは同じ変更単位に残した場合のみ許可 |
| 推奨 | 迷った場合は従う。従わない場合は理由を説明できる状態にする |
| 許可 | 使ってよいが、責務分離と型安全性を崩してはいけない |

「必要に応じて」は、以下のいずれかに該当する場合を指す。

- exported function、Reactコンポーネント、custom hook、usecase、mapper、API関数である
- 仕様上の制約、業務ルール、認証、認可、二重送信防止、キャッシュ更新に関わる
- 関数名や型名だけでは、存在理由または利用画面が読み取れない
- 将来の実装者が誤って責務を広げやすい

AIエージェントは、曖昧な判断を実装で勝手に補完しない。仕様・規約・既存実装のどれにも根拠がない場合は、先に仕様または規約へ追記してから実装する。

---

## 最優先ルール

以下は必ず守る。

- この規約は `docs/standards/common.md` よりもフロントエンド固有ルールとして優先する
- この規約にない共通事項は `docs/standards/common.md` に従う
- 仕様書と規約が矛盾した場合は、実装ではなくドキュメントを先に修正する
- 単一責務の原則を守る
- コンポーネントにAPI通信、入力正規化、複雑な状態管理を詰め込まない
- `page.tsx` を薄く保つ
- `features/` 単位で機能を分離する
- featureをまたぐ状態や処理を、特定feature配下に隠さない
- API DTOとdomain型を混ぜない
- DTOからdomain型への変換はmapperまたはusecaseに分離する
- `any` を禁止する
- `console.log` を残さない
- API URLや秘密情報をコードにベタ書きしない
- Supabaseのservice role keyなど秘密鍵をフロントエンドに置かない
- 仕様にない機能を勝手に追加しない
- ESLint / Prettier / TypeScript / test が通らない状態で完了しない
- 型エラーを `as any` や不要な型アサーションで握りつぶさない
- `eslint-disable` は原則禁止する
- 例外対応が必要な場合は、理由をコメントで明記する
- domain型、API DTO、共通props型は専用ファイルに分離する
- 型定義をコンポーネントファイルに無秩序に増やさない
- 型定義ファイルには実装ロジックを書かない
- 複雑な型ガードは型定義ファイルに置かず `*.guard.ts` に分離する
- 型だけをimportする場合は `import type` を使う
- barrel exportは原則禁止する
- テスト対象ごとに責務を分け、複数観点を1つのテストに詰め込まない

---

### 実装時の判断順序

実装で迷った場合は、必ず以下の順で判断する。

1. `docs/product/spec.md`
2. `docs/front-end/spec.md`
3. この規約
4. `docs/standards/common.md`
5. 既存実装の局所的な慣習

上位の仕様・規約と既存実装が矛盾する場合は、既存実装を正としない。修正範囲が大きくなる場合は、最小修正で仕様・規約へ寄せる。

### 例外の扱い

禁止・原則禁止ルールへの例外は、以下の条件をすべて満たす場合のみ許可する。

- 例外理由を同じファイルの該当箇所または近接するREADMEに明記する
- 代替案を検討したことが分かる
- 削除条件または見直し条件がある
- 例外の影響範囲が1ファイルまたは1featureに閉じている

例外コメントの形式は以下に統一する。

```ts
// exception(frontend-rule): 外部ライブラリの型不備を吸収するため一時的に使用する。型定義を追加したら削除する。
```

`any`、`as any`、`@ts-ignore`、秘密情報の露出、認可回避、二重送信を起こす実装は、例外コメントがあっても禁止する。

---

## コメント方針

### 基本方針

exportする関数、Reactコンポーネント、hook、usecase、mapper、API関数、重要な型には、日本語コメントを書く。

コメントは「コードが何をしているか」ではなく、「何のために存在するか」「どういう意図で使うか」を説明する。

ただし、以下のようなコメントは書かない。

- 関数名、変数名、型名の言い換えだけ
- 実装手順を1行ずつ説明するもの
- 仕様書の全文コピー
- 実装と乖離しやすい細かすぎる説明

小さな非export関数で、名前だけで目的が明確なものはコメント不要とする。

### 良いコメント例

```ts
// 出費入力欄の文字列を、APIに送信できる整数の金額へ正規化する
export const normalizeExpenseAmount = (input: string): number => {
  // ...
};
```

```tsx
// トップ画面で最短導線の出費登録を行うための金額入力コンポーネント
export const ExpenseAmountInput = () => {
  // ...
};
```

```ts
// 出費登録後にトップ画面で必要な一覧とサマリーを更新するためのmutation hook
export const useCreateExpenseOnBlur = () => {
  // ...
};
```

### 悪いコメント例

```ts
// inputをreplaceする
const normalized = input.replace(',', '');
```

```tsx
// ボタンを表示する
return <Button>保存</Button>;
```

---

## ディレクトリ責務

フロントエンドコードは `front-end/src/` 配下に配置する。

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

`page.tsx` は画面の骨組みとfeature componentの配置を主責務とする。

`page.tsx` に以下を書きすぎない。

- API通信の詳細
- 入力正規化
- 複雑な状態管理
- 複雑な表示分岐
- 業務ロジック

### `app/providers.tsx`

Client Componentとして必要なProviderを集約する。

配置するProviderの例：

- MUI Theme Provider
- TanStack Query Provider
- 必要に応じたAuth関連Provider

`layout.tsx` にProviderの詳細実装を直接書きすぎない。

### `domains/`

アプリ内で中心的に使う型を配置する。

API DTOをそのまま置かない。

React依存、API通信、hooksは置かない。

### `features/`

機能単位の実装を配置する。

各featureは以下の責務に分ける。

```txt
features/{featureName}/
  api/
  components/
  hooks/
  usecases/
  mappers/
```

### `features/*/api/`

HTTP通信のみを担当する。

以下を置く。

- API関数
- request DTO
- response DTO
- API固有のrequest / response整形

UI表示、React state管理、DTOからdomain型への変換は置かない。

### `features/*/components/`

feature固有のUIコンポーネントを置く。

API通信を直接書かない。

必要なデータやイベントハンドラはpropsまたはhooksから受け取る。

### `features/*/hooks/`

Reactの状態管理、TanStack Query、イベント処理をまとめる。

コンポーネントの肥大化を防ぐため、以下はhooksへ分離する。

- API取得状態
- mutation処理
- Undo制御
- blur / Enterの二重送信防止
- Snackbar表示制御

### `features/*/usecases/`

フロントエンド都合の処理の流れをまとめる。

例：

- 入力値の正規化
- API呼び出し前の変換
- APIレスポンスからdomain型への変換

ただし、残額計算、固定費判定、年間集計などの正となる業務ロジックは置かない。

### `features/*/mappers/`

API DTOとdomain型の変換を配置する。

DTOからdomain型への変換を、component、hook、api関数に直接書かない。

変換処理が小さい場合でも、再利用やテストが必要なものはmapperまたはusecaseへ分離する。

例：

```txt
features/expense/mappers/expenseMapper.ts
features/income/mappers/incomeMapper.ts
```

### `components/`

複数featureで利用する汎用UIを置く。

Atomic Design寄りに以下のディレクトリで分ける。

- `components/atoms/`
- `components/molecules/`
- `components/organisms/`

特定featureの業務ロジックを混ぜない。

分類基準:

- `atoms/`: `AppButton`、`AppTextField`、`AmountText` など、アプリ全体で見た目や挙動を統一する最小UI
- `molecules/`: `StatCard`、`PageHeader`、`EmptyState`、`ErrorMessage` など、atomsやMUIを組み合わせた小さな汎用UI
- `organisms/`: `AppShell`、`AppSideNav`、`AppBottomNav` など、複数featureで使う大きめの共通UI

feature固有の画面部品はAtomic Design分類へ寄せず、`features/{feature}/components/` に置く。

### `libs/`

外部ライブラリ設定や共通関数を置く。

例：

- `apiClient.ts`
- `apiError.ts`
- `supabaseClient.ts`
- `date.ts`
- `money.ts`

### `theme/`

MUI themeを配置する。

色、余白、角丸、Typographyなどはthemeで管理する。

### 配置判断表

実装場所で迷った場合は、以下の表で判断する。

| 置きたいもの | 配置先 | 置いてはいけない場所 |
|---|---|---|
| ルーティング、ページ骨組み | `app/` | `features/*/components/` |
| feature固有UI | `features/{feature}/components/` | `components/` |
| 複数featureで使う最小UI | `components/atoms/` | 特定feature配下 |
| 複数featureで使う小さな組み合わせUI | `components/molecules/` | 特定feature配下 |
| 複数featureで使う大きめの共通UI | `components/organisms/` | 特定feature配下 |
| React state、query、mutation | `features/{feature}/hooks/` | `page.tsx`、API関数 |
| 入力正規化、画面都合の処理手順 | `features/{feature}/usecases/` または `libs/` | component、hook内の長い分岐 |
| DTOとdomain型の変換 | `features/{feature}/mappers/` | component、hook、api関数 |
| HTTP通信 | `features/{feature}/api/` | component、page、hookの中の直書き |
| domain型 | `domains/{domain}/` | API DTO、props型ファイル |
| API DTO | `features/{feature}/api/*Dto.ts` | domain型ファイル |
| 汎用format関数 | `libs/` | feature固有component |
| MUI theme設定 | `theme/` | component内の大量`sx` |

判断に迷うものは、より依存が少ない場所へ置く。feature固有か共通か判断できない段階では、まずfeature配下に置き、2つ以上のfeatureから実利用された時点で共通化を検討する。

### ファイル作成単位

1ファイルには、原則として1つの主要責務だけを置く。

以下は禁止する。

- 1ファイルに複数の大きなReactコンポーネントを置く
- API関数とDTOとmapperを1ファイルにまとめる
- hookとcomponentを1ファイルにまとめる
- test helper以外で、無関係な関数を便利置き場として集める

許可する例外は以下に限る。

- そのファイル内でしか使わない小さなprivate helper
- そのコンポーネント専用の小さなprops型
- test file内のfixtureまたはrender helper

---
