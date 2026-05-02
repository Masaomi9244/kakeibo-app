# Product Specs

このファイルは、プロダクト仕様の入口です。

以前はMVP仕様を1ファイルにまとめていましたが、保守性のため役割ごとに分割しました。

---

## 読む順番

プロダクト仕様を確認する場合は、以下の順で読みます。

1. `overview.md`
2. `scope.md`
3. `glossary.md`
4. `open-questions.md`
5. `roadmap.md`

---

## ファイル一覧

| ファイル | 内容 |
|---|---|
| `overview.md` | アプリ概要、最優先仕様、認証方針、技術スタック概要 |
| `scope.md` | MVP目的、やらないこと、画面一覧、MVP完了条件 |
| `glossary.md` | 用語定義、残額計算、収入・固定費・出費の扱い |
| `open-questions.md` | 決定済み方針と未決事項 |
| `roadmap.md` | 実装順序、将来追加したい機能 |

---

## 仕様判断ルール

仕様で迷った場合は、以下の順で判断します。

1. `overview.md`
2. `scope.md`
3. `glossary.md`
4. `open-questions.md`
5. `roadmap.md`
6. `../front-end/spec.md`
7. `../back-end/spec.md`
8. `../db/spec.md`
9. `../standards/common.md`
10. 各領域のコーディング規約

この仕様にない機能を、実装都合で追加しません。

仕様書同士が矛盾する場合は、コードではなく仕様書を先に修正します。

`roadmap.md` の「将来追加したい機能」にあるものは、MVPでは実装しません。
