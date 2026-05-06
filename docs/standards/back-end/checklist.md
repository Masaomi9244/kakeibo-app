# Backend Checklist

バックエンド実装前後の確認項目です。

---

## 禁止事項

以下は禁止する。

- 仕様にないAPI、DB項目、業務ルールを追加する
- handlerにDB操作を書く
- handlerに集計計算を書く
- usecaseにEcho context、HTTP status、request DTO、response DTOを持ち込む
- repositoryに業務ロジックを書く
- domainにGORM、Echo、HTTP、環境変数を持ち込む
- GORM modelをdomain modelとして使う
- request DTOをrepositoryまで流す
- `user_id` をrequestから受け取る
- IDだけで取得・更新・削除する
- access tokenや秘密情報をログに出す
- 通常処理でpanicする
- エラーを握りつぶす
- DBエラー詳細をresponseへ出す
- SQLを文字列結合で組み立てる
- DBサーバーのtimezoneに依存する
- parse失敗した日付を現在日時へ置き換える
- `context.Background()` をrequest処理内で下位層へ渡す
- `utils`、`common`、`helper` packageへ責務不明な処理を集める
- テストで複数責務をまとめて検証する
- `make check` を通さずに完了扱いにする
- `doc-check` を理由なく回避する
- lint、format、vet、race test、DB lintの失敗を警告扱いで見逃す
- GoDoc不足をあと回しにして完了扱いにする

---

## レビュー観点

バックエンド実装レビューでは以下を確認する。

- 仕様書と矛盾していないか
- オニオンアーキテクチャの依存方向を守っているか
- handler、usecase、repository、domainの責務が分かれているか
- `user_id` をrequestから受け取っていないか
- 取得、更新、削除がuserIDで絞られているか
- IDだけで更新・削除していないか
- フロントエンドの入力値を信用していないか
- バリデーションがhandlerとusecaseの適切な境界にあるか
- DBエラーや内部エラーをresponseへ漏らしていないか
- 秘密情報や個人情報をログに出していないか
- transaction境界がusecaseから分かるか
- GORMやSQLがinfrastructure層に閉じているか
- DTO、domain model、GORM modelが混ざっていないか
- 日付範囲がAsia/Tokyo基準でstart inclusive / end exclusiveになっているか
- `time.Now()` がテスト不能な形で埋め込まれていないか
- contextが第一引数で渡っているか
- `make check` が通っているか
- テスト対象が責務ごとに分離されているか

---

## AIエージェント向け実装手順

AIエージェントがバックエンドを変更する場合は、以下の順で作業する。

1. `docs/standards/agent-workflow.md`、関連する仕様書、この規約を読む
2. 既存の近い実装を探す
3. 変更対象の責務をdomain、usecase、infrastructure、interfaceのどこに置くか決める
4. request DTO、usecase input / output、domain model、GORM model、response DTOの境界を先に決める
5. 認証済みuserIDがどの層まで渡るか確認する
6. repository呼び出しでuserIDによる認可境界が守られるか確認する
7. 実装する
8. 必要なテストを追加または更新する
9. `make check` を実行する
10. 未実行または失敗があれば、理由と残リスクを報告する

AIエージェントは以下をしてはいけない。

- 仕様にないAPI、DB項目、業務ルールを追加する
- 曖昧なまま既存実装の雰囲気だけでファイルを増やす
- handlerに処理を集めてから後で分ける
- userIDの扱いをrequest由来にする
- IDだけで更新・削除する
- 失敗した検証コマンドを隠して完了扱いにする
- lintルールや `make check` を一時的に弱めて完了扱いにする

---

## 変更前チェックリスト

実装前に以下を確認する。

- 変更対象のAPIまたはusecaseが仕様書に存在する
- 正となる業務ロジックをフロントエンドへ逃がしていない
- request DTO、usecase input / output、domain model、GORM model、response DTOの境界が決まっている
- handler、usecase、repository、middlewareの責務が分かれている
- userIDの取得元と受け渡しが決まっている
- 更新・削除で `id + userID` を使う設計になっている
- 追加するファイル名とpackage名が責務を表している
- 既存のlint / format / test方針と矛盾しない

---

## 完了条件

バックエンド変更は、以下を満たした場合のみ完了とする。

- 仕様書または規約と矛盾していない
- handler、usecase、repository、domainの責務が混ざっていない
- userIDをrequestから受け取っていない
- ユーザー所有データの取得、更新、削除がuserIDで絞られている
- フロントエンドの入力値を信用せず、バックエンドで検証している
- DBエラーや内部エラーをresponseへ漏らしていない
- 秘密情報、access token、個人情報をログへ出していない
- GORMやSQLがinfrastructure層に閉じている
- DTO、domain model、GORM modelが分離されている
- 日付・タイムゾーン処理がAsia/Tokyo基準でテスト可能になっている
- transactionが必要な処理で境界が明確になっている
- すべての関数、method、type、interfaceに規約どおりのGoDocがある
- テストが責務ごとに分かれている
- `make doc-check` が成功している
- `make check` が成功している

---

## 例外申請テンプレート

禁止または原則禁止ルールの例外を作る場合は、以下を近接コメントまたはREADMEに残す。

```md
### backend-rule exception

- 対象ルール:
- 例外が必要な理由:
- 検討した代替案:
- 影響範囲:
- 削除または見直し条件:
```

例外は恒久化しない。削除条件が書けない例外は、設計を見直す。
