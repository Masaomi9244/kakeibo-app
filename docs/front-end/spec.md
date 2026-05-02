# Frontend Spec

このファイルは、フロントエンド仕様の入口です。

以前は画面仕様、アーキテクチャ、状態管理、UI方針を1ファイルにまとめていましたが、保守性のため役割ごとに分割しました。

---

## 読む順番

フロントエンド関連の仕様を確認する場合は、以下の順で読みます。

1. `../product/overview.md`
2. `../product/scope.md`
3. 該当する `../features/*.md`
4. `../architecture/front-end.md`
5. 該当する `../api/*.md`
6. `../standards/front-end/index.md`

---

## 主な移行先

| 内容 | 移行先 |
|---|---|
| 技術スタック、Next.js構成、状態管理、UI方針 | `../architecture/front-end.md` |
| ログイン画面 | `../features/auth.md` |
| トップ画面 | `../features/home.md` |
| 収入画面 | `../features/incomes.md` |
| 固定費画面 | `../features/fixed-costs.md` |
| カレンダー画面 | `../features/calendar.md` |
| 年間サマリー画面 | `../features/annual-summary.md` |
| スマホホーム画面対応 | `../features/pwa.md` |
| API接続先の契約 | `../api/*.md` |
| 実装規約 | `../standards/front-end/index.md` |

---

## 注意

このファイルは互換性のために残します。

新しい仕様追加や修正は、該当する `features/`、`architecture/`、`api/`、`standards/` のファイルに行います。
