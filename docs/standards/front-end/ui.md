# Frontend UI Standards

フォーム、MUI、アクセシビリティに関する規約です。

---

## 入力・フォーム規約

### 金額入力

金額は整数として扱う。

以下を禁止する。

- 空欄
- 0円以下
- 小数
- マイナス値
- 数字以外

### 金額正規化

出費入力では以下を行う。

- カンマを除去する
- 全角数字を半角数字へ変換する
- 整数へ正規化する
- API送信前に不正値を弾く

### blur / Enter保存

出費入力では、フォーカスアウトとEnterキー押下で保存できる。

ただし、Enter保存後にblurが発火しても二重保存しない。

二重保存防止は必ず実装する。

### Undo

Undoは最後に登録した出費1件のみ対象とする。

連続登録時は、Undo対象を最新の出費に置き換える。

---

## MUI規約

### theme

MUI themeは `src/theme/theme.ts` に定義する。

色、余白、角丸、Typographyはthemeで管理する。

コンポーネント内で直接色やサイズをベタ書きしすぎない。

### MUIコンポーネント利用

汎用UIはMUIを直接使ってよい。

ただし、アプリ全体で見た目や挙動を統一したいものは `components/atoms` にラッパーを作る。

例：

- `AppButton`
- `AppTextField`
- `AmountText`

atomsより大きい共通UIは、責務に応じて以下に置く。

- `components/molecules/`: `StatCard`、`PageHeader`、`EmptyState` などの小さな組み合わせUI
- `components/organisms/`: `AppShell`、`AppSideNav`、`BudgetHero`、`IncomeForm` などの大きめのUI
- `components/templates/`: `HomePageContent`、`IncomePageContent` などrouteに接続する画面単位UI

feature固有の画面部品も `features/{feature}/components/` には置かず、Atomic Design分類に従って `components/` 配下へ置く。

### sxの扱い

`sx` は使用してよい。

ただし、`sx` に渡すstyle objectをコンポーネントファイルへ直接書くことは禁止する。

コンポーネント固有のstyle objectは、同じディレクトリまたは同名ディレクトリの `*.styles.ts` に切り出す。
動的なstyleも `getXxxSx()` のような関数として `*.styles.ts` に置く。

例：

```txt
components/templates/HomePageContent/HomePageContent.tsx
components/templates/HomePageContent/HomePageContent.styles.ts
components/atoms/AmountText.tsx
components/atoms/AmountText.styles.ts
```

`*.styles.ts` は表示スタイルだけを持つ。React component、API通信、状態管理、domainロジックを置かない。
style objectは名前付きexportにし、default exportは禁止する。
型は `SxProps<Theme>`、MUI component固有の型、または責務が分かる専用readonly型で明示する。

1行程度の局所的な `sx` も原則禁止する。
MUIの `color`、`variant`、`spacing` などpropsで表現できる場合はpropsを使い、`sx` が必要な場合は必ず `*.styles.ts` へ置く。

以下は禁止する。

- `sx` に同じ色コードを複数箇所で直書きする
- JSX内に `{ fontWeight: 700 }` のようなinline style objectを書く
- themeにある値を使わずに、余白・角丸・Typographyを大量に直書きする
- `!important` を使う
- レスポンシブ対応を個別componentに場当たり的に散らす
- 型のないstyle objectをexportする

画面固有の一時的な調整も `*.styles.ts` に置く。
2箇所以上で同じ見た目が必要になった時点で共通componentまたはthemeへ寄せる。

### アクセシビリティ

操作可能なUIには、キーボード操作と支援技術で意味が伝わる名前を付ける。

以下は必須とする。

- icon buttonには `aria-label` を付ける
- form inputにはlabelを付ける
- エラー文言は対象inputと関連付ける
- disabled状態だけで理由を伝えない
- 色だけで状態を表現しない
- 金額、日付、エラーなど重要情報はテキストでも伝える

MUI componentを使う場合も、アクセシビリティ属性が適切に渡っていることを確認する。

---
