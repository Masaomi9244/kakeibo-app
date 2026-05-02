# Backend Spec

このファイルは、バックエンド仕様の入口です。

以前はアーキテクチャ、API契約、認証、DB、テスト方針を1ファイルにまとめていましたが、保守性のため役割ごとに分割しました。

---

## 読む順番

バックエンド関連の仕様を確認する場合は、以下の順で読みます。

1. `../product/overview.md`
2. `../product/scope.md`
3. `../architecture/back-end.md`
4. `../api/common.md`
5. 該当する `../api/*.md`
6. 該当する `../db/*.md`
7. `../standards/back-end/index.md`

---

## 主な移行先

| 内容 | 移行先 |
|---|---|
| 技術スタック、基本方針、オニオンアーキテクチャ | `../architecture/back-end.md` |
| 認証・認可、middleware、ローカル開発方針 | `../architecture/back-end.md`, `../features/auth.md` |
| CORS、インフラ | `../architecture/infra.md` |
| API共通仕様、エラー形式、HTTP status | `../api/common.md` |
| 出費API | `../api/expenses.md` |
| 収入API | `../api/incomes.md` |
| 固定費API | `../api/fixed-costs.md` |
| 月次サマリーAPI | `../api/monthly-summary.md` |
| カレンダーAPI | `../api/expense-calendar.md` |
| 年間サマリーAPI | `../api/annual-summary.md` |
| DB schema、index、制約、集計 | `../db/*.md` |
| 実装規約 | `../standards/back-end/index.md` |

---

## 注意

このファイルは互換性のために残します。

新しい仕様追加や修正は、該当する `architecture/`、`api/`、`db/`、`standards/` のファイルに行います。
