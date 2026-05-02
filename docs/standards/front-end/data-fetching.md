# Frontend Data Fetching Standards

API Client、TanStack Query、環境変数に関する規約です。

---

## API Client規約

### 共通API Client

API通信は `libs/apiClient.ts` を通す。

各featureのapi関数は、直接 `fetch` を雑に書かず、共通API Clientを利用する。

### Authorization

APIリクエストにはSupabase Authのaccess tokenを付与する。

```txt
Authorization: Bearer <access_token>
```

access tokenが取得できない場合は、APIリクエストを送らない。

### APIエラー

APIエラーは `libs/apiError.ts` で共通処理する。

バックエンドのエラーレスポンス形式に合わせる。

```ts
export type ApiErrorResponse = {
  message: string;
  details?: {
    field?: string;
    message: string;
  }[];
};
```

APIエラーを `any` として扱わない。

### API DTO

API DTOは `features/*/api/` に置く。

API DTOを画面全体に広げすぎない。

DTOからdomain型への変換は、mapperまたはusecaseに分離する。

component、hook、api関数内でDTOのshapeを前提にしたdomain変換を直接書かない。

変換処理が以下に当てはまる場合は、専用のmapper関数にする。

- 複数箇所で使う
- null / undefinedの補完を含む
- 日付、金額、IDなどの表現変換を含む
- レスポンスDTOを複数のdomain型に分解する

例：

```txt
features/expense/mappers/expenseMapper.ts
features/expense/usecases/createExpenseUsecase.ts
```

### fetchの直接利用禁止

featureやcomponentから `fetch` を直接呼ばない。

HTTP通信は必ず `libs/apiClient.ts` または `features/*/api/` 経由にする。

### API URLの扱い

API URLは `NEXT_PUBLIC_API_BASE_URL` から取得する。

コード内に以下のようなURLを直書きしない。

```txt
http://localhost:8080
https://example.com
```

### リトライ方針

MVPではmutationの自動リトライは原則無効にする。

出費登録などの書き込み処理が意図せず複数回実行されないようにする。

### API関数の形

API関数は、request DTOを受け取り、response DTOを返す。

成功レスポンスDTOは `docs/api/common.md` の形式に合わせる。

一覧レスポンスは必ず `{ items: [...] }` として扱い、配列直返しを前提にしない。

```ts
export const createExpense = async (
  request: CreateExpenseRequest,
): Promise<CreateExpenseResponse> => {
  // ...
};
```

API関数内でdomain型へ変換しない。domain型への変換はmapperまたはusecaseで行う。

API関数は以下を必ず満たす。

- request / responseの型を明示する
- access tokenがない場合は送信しない
- HTTP statusとAPIエラー形式を共通処理へ渡す
- `fetch` の失敗、JSON parse失敗、APIエラーを区別できる形で扱う
- 秘密情報、access token、個人情報をログに出さない

### API境界のruntime validation

外部APIレスポンスはTypeScriptの型だけで信用しない。

MVPでは全レスポンスにruntime validationを必須とはしないが、以下は型ガードまたはvalidation導入を必須とする。

- 金額、日付、ID、認証状態に関わるレスポンス
- `unknown` として受け取るエラーレスポンス
- nullableが多く、UIで分岐が増えるレスポンス
- 仕様変更時に画面破綻しやすいレスポンス

validationを追加する場合は、componentではなくAPI境界、mapper、usecaseのいずれかに置く。

---

## TanStack Query規約

### query key

query keyはfeatureごとに関数として定義する。

```ts
export const monthlySummaryQueryKey = (month: string) => ["monthlySummary", month] as const;
export const todayExpensesQueryKey = (date: string) => ["expenses", "today", date] as const;
```

文字列配列を各所に直接書き散らさない。

### mutation後のinvalidate

mutation成功後は、関連するqueryをinvalidateする。

出費登録成功後にinvalidateするもの：

- 今日の出費一覧
- 月次サマリー
- カレンダー

収入・固定費の登録、更新、削除後にinvalidateするもの：

- 月次サマリー
- 必要に応じてカレンダー

### query / mutationの配置

TanStack Queryを直接扱う処理は、原則 `features/*/hooks/` に置く。

コンポーネント内にquery / mutation処理を直接書きすぎない。

### staleTime / gcTime方針

queryごとに必要に応じて `staleTime` を設定する。

ただし、MVPでは過度なキャッシュ最適化よりも正確な再取得を優先する。

出費、月次サマリー、カレンダーはmutation後に必ずinvalidateする。

### mutationの多重実行防止

mutation中は同じ操作を再実行しない。

特に出費登録では、blur / Enter / ボタン操作などが重なっても二重登録されないようにする。

---

## 環境変数規約

フロントエンドで利用する環境変数は以下とする。

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_APP_ENV
```

秘密鍵やservice role keyはフロントエンドに置かない。

環境変数が未設定の場合は、分かりやすいエラーを出す。

---
