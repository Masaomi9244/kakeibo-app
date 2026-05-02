# DB Spec

このファイルは、DB仕様の入口です。

以前はschema、index、制約、migration、集計方針を1ファイルにまとめていましたが、保守性のため役割ごとに分割しました。

---

## 読む順番

DB関連の仕様を確認する場合は、以下の順で読みます。

1. `../architecture/db.md`
2. `schema.md`
3. `constraints.md`
4. `indexes.md`
5. `aggregation.md`
6. `migrations.md`
7. `../standards/db/index.md`

---

## ファイル一覧

| ファイル | 内容 |
|---|---|
| `schema.md` | テーブル一覧、カラム、テーブルごとの制約 |
| `constraints.md` | UUID、check制約、外部キー、バリデーション方針 |
| `indexes.md` | インデックス方針、推奨DDL |
| `aggregation.md` | 月次・日次・年次集計、日付・タイムゾーン |
| `migrations.md` | マイグレーション方針、配置、初期データ |

---

## 注意

このファイルは互換性のために残します。

新しいDB仕様の追加や修正は、該当する `schema.md`、`constraints.md`、`indexes.md`、`aggregation.md`、`migrations.md` に行います。
