# Agent Implementation Workflow

## 目的

AIエージェントが実装依頼を受けたときに、読む順番、判断順序、変更範囲、確認タイミング、完了報告を迷わないようにする。

このドキュメントは、個別のフロントエンド規約、バックエンド規約、DB規約より前に読む。
実装前後の保守性ゲートは `implementation-quality-gates.md` も必ず確認する。

---

## 最初に行うこと

実装依頼を受けたら、まず依頼を以下のどれに該当するか分類する。

| 依頼種別 | 主な対象 | 最初に読む |
|---|---|---|
| 仕様確認 | docsのみ | `docs/README.md`, `docs/product/*.md` |
| 画面実装 | front-end | `docs/standards/implementation-quality-gates.md`, `docs/product/overview.md`, `docs/features/*.md`, `docs/architecture/front-end.md`, `docs/standards/front-end/index.md` |
| API実装 | back-end | `docs/standards/implementation-quality-gates.md`, `docs/api/common.md`, 該当する `docs/api/*.md`, `docs/architecture/back-end.md`, `docs/standards/back-end/index.md` |
| DB変更 | db, back-end | `docs/standards/implementation-quality-gates.md`, `docs/db/schema.md`, `docs/db/migrations.md`, `docs/db/constraints.md`, `docs/standards/db/index.md` |
| 認証・認可 | front-end, back-end, db | `docs/standards/implementation-quality-gates.md`, `docs/features/auth.md`, `docs/architecture/back-end.md`, `docs/standards/back-end/auth.md`, `docs/standards/db/constraints-and-indexes.md` |
| 集計処理 | back-end, db, front-end | `docs/standards/implementation-quality-gates.md`, `docs/product/glossary.md`, `docs/db/aggregation.md`, 該当する `docs/api/*.md` |
| 横断変更 | 複数領域 | `docs/README.md`, `docs/standards/implementation-quality-gates.md`, `docs/product/open-questions.md`, 関連する全領域のindex |

依頼が複数種別にまたがる場合は、もっとも外側の仕様から読み、次にAPI、DB、実装規約の順で読む。

---

## 実装前のDefinition of Ready

以下を満たしてから実装に入る。

- 対象機能が `docs/product/scope.md` または `docs/features/*.md` に存在する
- APIを触る場合、該当endpointのrequest / response / status / error方針が `docs/api/*.md` にある
- DBを触る場合、schema、constraint、index、migration方針が `docs/db/*.md` にある
- 認証済みユーザー本人のデータだけを扱う条件が確認できている
- `user_id` をrequest body、query、URL parameterから受け取らない設計になっている
- 実装場所の規約を `docs/standards/**/*.md` で確認している
- 仕様にない判断が必要な場合は、コードではなくdocsを先に更新する
- コメント、責務分離、style、DTO/domain/DB model境界を `implementation-quality-gates.md` で確認している
- 機械チェックが存在する規約は、対象の `check` コマンドに含まれている

この条件を満たさない場合は、最小のdocs修正を行ってから実装する。

---

## 判断順序

実装で迷った場合は、以下の順で正とする。

1. ユーザーがその依頼で明示した最新の指示
2. `docs/product/overview.md`
3. `docs/product/scope.md`
4. `docs/product/glossary.md`
5. `docs/product/open-questions.md`
6. 該当する `docs/features/*.md`
7. 該当する `docs/api/*.md`
8. 該当する `docs/db/*.md`
9. 該当する `docs/architecture/*.md`
10. 該当する `docs/standards/**/*.md`
11. 既存実装の局所的な慣習

既存実装がdocsと矛盾する場合は、docsを優先候補とする。

ただし、既存実装の変更範囲が大きくなる場合は、実装前に影響範囲を整理して確認する。

---

## 変更範囲の決め方

依頼を満たすために必要な最小範囲を変更する。

| 変更内容 | 同時に確認するdocs |
|---|---|
| 画面の表示や操作を変える | `docs/features/*.md`, `docs/standards/front-end/*.md` |
| API request / responseを変える | `docs/api/common.md`, 該当する `docs/api/*.md`, front-end DTO, back-end DTO |
| DB schemaを変える | `docs/db/schema.md`, `docs/db/migrations.md`, `docs/db/indexes.md`, `docs/db/constraints.md` |
| 集計式を変える | `docs/product/glossary.md`, `docs/db/aggregation.md`, 集計API docs |
| 認証・認可を変える | `docs/features/auth.md`, `docs/architecture/back-end.md`, `docs/standards/back-end/auth.md` |
| 実装規約を変える | `docs/standards/common.md`, 該当領域のindexと分割ファイル |
| MVP範囲を変える | `docs/product/scope.md`, `docs/product/roadmap.md`, 関連feature docs |

仕様変更とリファクタリングを同じ変更に混ぜない。

やむを得ず同時に行う場合は、変更理由を分けて説明する。

---

## 確認が必要なとき

以下に該当する場合は、実装前にユーザーへ確認する。

- MVP範囲を広げる
- DB schemaを破壊的に変更する
- API responseの互換性を壊す
- 認証・認可の境界を変える
- 技術スタック、ライブラリ、ホスティング先を変える
- 既存データの移行方針が必要になる
- UIの主要導線や画面構成を変える
- docsに存在しない業務ルールを新しく決める

以下は確認なしで進めてよい。

- 誤字、リンク切れ、表記ゆれの修正
- docs内の明確な矛盾を、上位の判断順序に従って直す
- 既存規約に沿った小さな分割、命名修正、型の整理
- テスト、lint、formatのための局所修正
- 仕様を変えないdocsの分割や入口整理

---

## 実装中の進め方

1. 対象仕様と規約を読む
2. 変更対象ファイルを確認する
3. 既存実装の責務分離と命名を確認する
4. 変更範囲を小さく決める
5. docs不足があれば先にdocsを更新する
6. 機械チェックで固定できる規約不足があれば、実装前にcheck scriptまたはlint設定へ寄せる
7. 実装する
8. 対象範囲のテスト、lint、format、typecheckを実行する
9. 失敗があれば原因を切り分ける
10. 変更内容、確認結果、残リスクを報告する

途中で仕様判断が必要になった場合は、コードで仮決めしない。

`docs/product/open-questions.md` に未決として残すか、ユーザー確認後に決定済み方針として反映する。

---

## 完了条件

実装完了時は、以下を満たす。

- 依頼された挙動が実装されている
- 変更が仕様書と矛盾していない
- API DTO、domain model、DB modelの境界が混ざっていない
- 認証済みuserIDの扱いが規約どおりである
- UI変更の場合、主要操作とエラー状態が破綻していない
- API変更の場合、成功レスポンスとエラーレスポンスが `docs/api/common.md` に従っている
- DB変更の場合、migration、constraint、index、認可境界が確認されている
- 対象範囲のチェックリストを確認している
- 実行可能な検証コマンドを実行している
- フロントエンド変更では `npm run check` に `doc:check` が含まれている
- バックエンド変更では `make check` に `doc-check` が含まれている
- 実行できなかった検証がある場合、理由を報告している

---

## 横断整合性チェック

変更後は、触った領域に応じて以下の整合性を確認する。

### 画面仕様とAPI

- 画面で必要なデータが、該当API responseに存在する
- 画面から送る入力値が、該当API requestに存在する
- API responseのキー名がフロントエンドDTOと一致している
- ローディング、空状態、エラー状態を画面仕様または規約で扱える
- mutation後に更新すべきquery keyまたは再取得対象が明確である

### APIとDB

- API requestにある永続化項目がDB schemaに存在する
- API responseに含める項目がDBまたは集計結果から取得できる
- `user_id` による絞り込みが必要なqueryで抜けていない
- 作成・更新・削除で `id + user_id` による対象特定ができる
- 日付条件がAsia/Tokyo基準の範囲検索になっている

### DBと集計

- 集計に使うカラムがschemaに存在する
- 集計対象外のデータ条件が明確である
- 固定費の開始月、収入の `included_in_balance`、出費日時の扱いが仕様と一致している
- indexが主要な検索条件を支えている
- 物理削除による集計変化がMVP方針と矛盾していない

### 認証・認可

- フロントエンドはaccess tokenをAPIへ送る
- バックエンドはaccess tokenからuserIDを決定する
- request body、query、URL parameterから `user_id` を受け取っていない
- 他ユーザーのデータを取得・更新・削除できない
- ログアウト後にアプリ画面へ戻れない

### 規約と実装

- 新規ファイルの配置が各領域の配置判断表に沿っている
- DTO、domain model、DB modelが混ざっていない
- handler、usecase、repository、component、hookの責務が分離されている
- 命名が既存規約と一致している
- 例外的な実装を入れる場合、理由と削除条件がdocsまたはコメントに残っている

---

## 完了報告の形

完了報告では、以下を簡潔に書く。

- 何を変更したか
- 主な変更ファイル
- どの仕様・規約に沿って判断したか
- 実行した検証
- 未実行または失敗した検証
- 残っている確認事項

残っている確認事項がない場合は、その旨を書く。

---

## docs変更時の追加チェック

docsを変更した場合は、以下を確認する。

- Markdownリンクが切れていない
- コードフェンスが閉じている
- JSON例がparseできる
- Markdown tableの列数が揃っている
- `archive/` の内容を新規実装の正として参照していない
- 古い入口ファイルに実体を戻していない
- `open-questions.md` に通常実装を止める未決が残っていない

docsの構造を変えた場合は、`docs/README.md` のディレクトリ構成と入口説明も同時に更新する。
