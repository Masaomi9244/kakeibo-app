# Frontend Checklist

フロントエンド実装前後の確認項目です。

---

## 禁止事項

以下は禁止する。

- `any` を安易に使う
- `console.log` を残す
- `page.tsx` に処理を詰め込む
- コンポーネントから直接DBにアクセスする
- コンポーネント内にAPI通信を直接書きすぎる
- API DTOを画面全体に広げすぎる
- `use client` を全ファイルに機械的に付ける
- API URLをコードにベタ書きする
- 秘密鍵をフロントエンドに置く
- 同じquery keyを各所に直書きする
- 出費登録で二重保存される実装にする
- `eslint-disable` を理由なく追加する
- `@ts-ignore` を使う
- 不要な `as` で型エラーを隠す
- `fetch` をcomponentから直接呼ぶ
- `useEffect` でAPI取得を自作する
- query keyを文字列配列で各所に直書きする
- environment variable未設定時に黙って処理を続行する
- domain型、DTO、props型を1つの巨大な `types.ts` にまとめる
- 型定義ファイルに実装ロジックを書く
- 複雑な型ガードを型定義ファイルに置く
- componentファイル内に複数featureで使う型を置く
- `interface` を理由なく使う
- 型だけのimportを通常importで書く
- barrel exportを理由なく追加する
- DTOからdomain型への変換をcomponent、hook、api関数に直接書く
- UI、変換、API通信など複数責務を1つのテストに詰め込む

---

## レビュー観点

フロントエンド実装レビューでは以下を確認する。

- `page.tsx` が薄いか
- コンポーネントが単一責務か
- hooks / usecases / api の責務が分かれているか
- `any` を使っていないか
- コメントが目的や意図を説明しているか
- APIエラーを共通形式で扱っているか
- access tokenがない場合にAPIリクエストを送っていないか
- TanStack Queryのquery keyが共通化されているか
- mutation後に必要なqueryをinvalidateしているか
- 金額入力で小数、マイナス値、数字以外を弾いているか
- Enter保存とblur保存で二重登録されないか
- Undo対象が最新1件に置き換わるか
- MUI themeを利用しているか
- lint / format / test が通っているか
- `npm run typecheck` が通っているか
- ESLint無効化コメントに妥当な理由があるか
- import順が機械的に整理されているか
- `useEffect` が不要に使われていないか
- API通信が共通API Client経由になっているか
- mutationの多重実行防止ができているか
- domain型、API DTO、props型が適切なファイルに分離されているか
- 巨大な `types.ts` に型が集約されていないか
- 型定義ファイルに実装ロジックが混ざっていないか
- `interface` を使う理由が明確か
- 型だけのimportが `import type` になっているか
- barrel exportが追加されていないか
- DTOからdomain型への変換がmapperまたはusecaseに分離されているか
- 複雑な型ガードが `*.guard.ts` に分離されているか
- テスト対象が責務ごとに分離されているか

---

## AIエージェント向け実装手順

AIエージェントがフロントエンドを変更する場合は、以下の順で作業する。

1. `docs/standards/agent-workflow.md`、関連する仕様書、この規約を読む
2. 既存の近い実装を探す
3. 変更対象の責務を `app`、`features`、`domains`、`components`、`libs`、`theme` のどこに置くか決める
4. DTO、domain型、props型、mapper、hook、componentの境界を先に決める
5. 実装する
6. 必要なテストを追加または更新する
7. lint / format / typecheck / test を実行する
8. 未実行または失敗があれば、理由と残リスクを報告する

AIエージェントは以下をしてはいけない。

- 仕様にない画面、入力項目、API呼び出しを追加する
- 曖昧なまま既存実装の雰囲気だけでファイルを増やす
- 型エラーを回避するために `any`、`as any`、`@ts-ignore` を使う
- `page.tsx` に処理を集めてから後で分ける
- 失敗した検証コマンドを隠して完了扱いにする

---

## 変更前チェックリスト

実装前に以下を確認する。

- 変更対象の画面またはfeatureが仕様書に存在する
- 正となる業務ロジックをフロントエンドへ移していない
- API DTOとdomain型の境界が決まっている
- component、hook、usecase、mapper、apiの責務が分かれている
- 追加するファイル名が責務を表している
- 共通化が早すぎない
- 既存のlint / format / test方針と矛盾しない

---

## 完了条件

フロントエンド変更は、以下を満たした場合のみ完了とする。

- 仕様書または規約と矛盾していない
- `any`、`as any`、理由なしの型アサーションがない
- `console.log` が残っていない
- API URL、access token、秘密情報を直書きしていない
- `page.tsx` が薄い
- componentがUI表示に集中している
- hook、usecase、mapper、apiの責務が混ざっていない
- DTOからdomain型への変換がcomponent、hook、api関数に漏れていない
- query keyが共通化されている
- mutation後のinvalidateが必要範囲を満たしている
- blur / Enter / buttonなどの二重送信が防止されている
- 金額と日付の正規化・表示整形がテスト可能な関数へ分離されている
- 重要なexportには目的が分かるコメントがある
- テストが責務ごとに分かれている
- lint / format / typecheck / test の結果を確認している

---

## 例外申請テンプレート

禁止または原則禁止ルールの例外を作る場合は、以下を近接コメントまたはREADMEに残す。

```md
### frontend-rule exception

- 対象ルール:
- 例外が必要な理由:
- 検討した代替案:
- 影響範囲:
- 削除または見直し条件:
```

例外は恒久化しない。削除条件が書けない例外は、設計を見直す。
