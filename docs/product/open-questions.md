# Product Open Questions

## 現在の未決事項

現時点で、通常の実装を止める未決事項はない。

デプロイ実行直前の最新プラン、料金、制約確認は必要だが、実装方針は以下の決定事項を正とする。

---

## 決定済み方針

| 論点 | 決定 | 反映先 |
|---|---|---|
| ログアウト導線のMVP扱い | MVP完了条件に含める | `scope.md`, `roadmap.md`, `../features/auth.md` |
| CRUD / list APIの成功レスポンスDTO | 成功レスポンスはJSON object。作成・更新はリソースキー、一覧は `{ items: [...] }`、集計はendpoint対象キー、削除は `{ message: "削除しました" }` | `../api/common.md`, `../api/*.md`, `../standards/**/*.md` |
| Backendのデプロイ先 | MVPではRenderを正とする | `overview.md`, `roadmap.md`, `../architecture/infra.md` |
| スマホホーム画面対応の完了範囲 | manifest、theme color、icon、apple-touch-iconまでをMVP完了条件に含める。Service WorkerはMVP対象外 | `scope.md`, `../features/pwa.md` |

決定済み方針を変更する場合は、変更理由と影響範囲を先に確認し、反映先のドキュメントを同時に更新する。

---

## 新しい未決事項が出た場合の更新先

新しい未決事項を追加または解決したら、必要に応じて以下も更新する。

- `overview.md`
- `scope.md`
- `roadmap.md`
- `../front-end/spec.md`
- `../back-end/spec.md`
- `../db/spec.md`
- `../standards/**/*.md`
