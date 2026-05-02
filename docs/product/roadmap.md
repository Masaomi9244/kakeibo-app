# Product Roadmap

## 実装順序

### リポジトリ・ドキュメント整備

- front-end
- back-end
- README
- docs/README.md
- docs/product/spec.md
- docs/product/overview.md
- docs/product/scope.md
- docs/product/glossary.md
- docs/product/open-questions.md
- docs/product/roadmap.md
- docs/front-end/spec.md
- docs/back-end/spec.md
- docs/db/spec.md
- docs/standards/common.md
- docs/standards/front-end/index.md
- docs/standards/back-end/index.md
- docs/standards/db/index.md

### DB設計・マイグレーション作成

- users
- incomes
- fixed_costs
- expenses
- 必要なインデックス
- 初期マイグレーション

### Go APIの土台作成

- Echo導入
- GORM導入
- DB接続
- ルーティング作成
- CORS設定
- ヘルスチェックAPI作成
- 共通エラーレスポンス作成

### 認証なしでAPI実装

最初はローカル開発用に固定の `user_id` を使う。

この段階は開発途中の一時状態であり、MVP完了時点ではすべての主要APIを認証必須にする。

この段階ではAuth Middlewareは本実装しない。

開発用の固定 `user_id` を使って、API・DB・集計ロジックを先に完成させる。

Supabase Auth連携は後続のSupabase Auth連携工程で行う。

- 出費API
- 収入API
- 固定費API
- 月次サマリーAPI
- カレンダーAPI
- 年間サマリーAPI

### Next.jsの画面モック作成

- ログイン画面
- トップ画面
- 収入画面
- 固定費画面
- カレンダー画面
- 年間サマリー画面
- Bottom Navigation
- MUI Theme Provider設定
- TanStack Query Provider設定
- Supabase Client設定
- 共通API Client設定
- Web App Manifestとスマホホーム画面追加用のアイコン設定

### フロントとAPI接続

- 出費登録
- Undo
- 今日の出費取得
- 月次サマリー取得
- 収入CRUD
- 固定費CRUD
- カレンダー表示
- 年間サマリー表示

### Supabase Auth連携

- ログイン
- ログアウト
- アクセストークン取得
- Go APIへトークン送信
- Go API側でトークン検証
- usersレコードの取得または作成
- user_id紐づけ
- 未ログイン時のルートガード
- ログアウト後の `/login` 遷移

### テスト・動作確認

- 出費登録の二重登録防止
- Undo動作
- 収入の `included_in_balance` の反映
- 固定費の開始月反映
- 月次サマリー計算
- カレンダーの日別残額
- 年間サマリー計算
- 自分のデータだけが表示・更新・削除されること
- ログアウト後にアプリ画面を表示できないこと
- UUIDがDB側で生成されること
- users初回作成が同時実行で失敗しないこと
- CORSが開発環境と本番環境で適切に設定されていること

### デプロイ

- FrontendをVercelへデプロイ
- BackendをRenderへデプロイ
- DB/AuthはSupabaseを利用
- CORSの本番originを設定
- フロントエンドとバックエンドの環境変数を設定

---

## 将来追加したい機能

- 出費メモ編集
- 過去日への出費登録
- 月切り替えUI改善
- グラフ表示
- オフライン利用を含む本格的なPWA対応
- Service Workerによるキャッシュ・オフライン対応
- AWS移行
- 固定費の終了月設定
- 収入のテンプレート化
- 月ごとの目標貯金額
- 固定費の履歴管理
- 論理削除
