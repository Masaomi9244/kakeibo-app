# Implementation Quality Gates

## 目的

実装に入る前に、フロントエンド、バックエンド、DBの保守性が同じ基準で確認されるようにする。

このファイルは `agent-workflow.md` の補助です。
実装者とAIエージェントは、個別領域の規約へ進む前にこのゲートを確認します。

---

## 実装前ゲート

以下を満たすまでコード実装へ入らない。

- 変更対象が `product/` または `features/` のMVP範囲に存在する
- UI、API、DB、認証、集計のどの領域に影響するかを分けられている
- 変更対象の配置先が `architecture/` と `standards/` の両方で説明できる
- 入口docsと詳細docsに矛盾がない
- 既存実装の慣習がdocsと矛盾する場合、既存実装を正として扱っていない
- コメント、責務分離、style、型、テストの規約を確認している
- 規約で機械チェックできるものは `check` コマンドへ組み込まれている
- DB、API、Frontendをまたぐ変更では、ローカルで実データ確認できる起動導線が `Makefile` またはREADMEに存在する

どれか1つでも満たせない場合は、先にdocsまたは検証scriptを更新する。

---

## コメントゲート

コメント規約は努力目標にしない。

### フロントエンド

`front-end/src/` 配下では、以下をすべてTSDoc対象とする。

- 関数宣言
- arrow function / function expressionを代入した変数
- Reactコンポーネント
- custom hook
- mapper
- API関数
- type
- interface

関数系のTSDocには必ず以下を含める。

- `@description`
- `@param`
- `@returns`
- `@example`

検証は `npm run doc:check` で行い、`npm run check` に含める。

### バックエンド

`back-end/` 配下では、以下をすべてGoDoc対象とする。

- 関数
- method
- type
- interface

GoDocは対象識別子名から始める。
検証は `make doc-check` で行い、`make check` に含める。

---

## 責務分離ゲート

新規ファイルまたは大きめの変更では、変更前に以下を決める。

| 観点     | フロントエンド                             | バックエンド                                             |
| -------- | ------------------------------------------ | -------------------------------------------------------- |
| 入力     | component / hook / usecaseのどこで受けるか | handler / usecaseのどこで検証するか                      |
| 変換     | DTO、domain、view modelをどこで変換するか  | DTO、usecase input、domain、GORM modelをどこで変換するか |
| 副作用   | API通信、mutation、cache更新をどこに置くか | DB query、transaction、外部通信をどこに置くか            |
| 表示     | componentとstylesに閉じているか            | HTTP response DTOに閉じているか                          |
| 業務判断 | フロントに正計算を持たせていないか         | usecase/domainに置かれているか                           |

判断に迷う場合は、実装で仮置きせず、該当する `architecture/` または `standards/` を先に更新する。

---

## styleゲート

フロントエンドの見た目は、以下の順で寄せる。

1. MUI theme
2. 共通component
3. `*.styles.ts`
4. component内の短い `sx`

component内の `sx` は、以下のいずれかに該当した時点で切り出す。

- 3行以上
- 同じ見た目が2箇所以上
- レスポンシブ指定を含む
- theme tokenの組み合わせが複数ある
- hover / focus / disabledなど状態styleを含む

`*.styles.ts` は表示styleだけを持つ。
React component、API通信、domain変換、状態管理を置かない。

---

## API / DB / UI整合ゲート

UI、API、DBのいずれかを触る場合は、以下を確認する。

- UIで表示する値がAPI responseに存在する
- UIから送る値がAPI requestに存在する
- APIが保存・集計する値がDB schemaに存在する
- `user_id` はrequestから受け取らず、認証済みuserから決定している
- 日次、月次、年次の集計はAsia/Tokyo基準で説明できる
- mutation後の再取得またはcache更新対象が明確である
- DB制約とバックエンドvalidationが矛盾していない

---

## MVP横断QAゲート

MVP対象の主要画面を実データ接続した後は、画面単体の表示確認だけで完了しない。
以下の横断更新を確認し、登録・更新・削除後に関連集計が戻ることまで見る。

- 収入の登録・更新・削除・`includedInBalance` 切り替え後、ホームと年間サマリーの収入、残額、収支が更新される
- 固定費の登録・更新・削除後、ホーム、カレンダー、年間サマリーの固定費、残額、収支が更新される
- ホームの出費登録・削除後、ホーム、カレンダー、年間サマリーの出費、残額、収支が更新される
- 日付、月、年をまたぐ集計はAsia/Tokyo基準で確認する
- QA用に作成したデータは検証後に削除し、月次・年次・カレンダー集計が検証前の値へ戻ることを確認する
- 画面のローディング、エラー、空状態がユーザーにとって不自然でないことを確認する

APIで横断QAを行う場合でも、Frontendの対象routeが `200 OK` を返すことは最低限確認する。
ブラウザ操作で確認できる環境では、同じ手順を画面上の操作でも確認する。

---

## ローカル起動ゲート

API、DB、Frontendをまたぐ実装では、完了前に以下のどちらかを実行する。

```bash
make dev
```

または、terminalを分けて以下を実行する。

```bash
make dev-setup
make api
make web
```

`http://localhost:3000` を開き、対象画面が実データで表示されることを確認する。

DB接続に失敗した場合は、以下を確認する。

- Docker Desktopが起動しているか
- `localhost:5433` がこのprojectのPostgreSQLを指しているか
- `DATABASE_URL` が `Makefile` と `.env.example` で一致しているか
- migrationが適用済みか
- seedが投入済みか
- APIの `/health` が成功するか

---

## 完了前ゲート

完了前に必ず以下を実行する。

### フロントエンドを触った場合

```bash
cd front-end
npm run check
```

### バックエンドまたはDBを触った場合

```bash
cd back-end
make check
```

実行できない検証がある場合は、未実行理由と残リスクを完了報告に書く。
