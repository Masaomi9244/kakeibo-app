# Backend Architecture Standards

バックエンドのディレクトリ責務と配置判断に関する規約です。

---

## ディレクトリ責務

バックエンドコードは `back-end/` 配下に配置する。

```txt
back-end/
  cmd/
    api/
  internal/
    domain/
    usecase/
    infrastructure/
    interface/
  migrations/
```

### `cmd/api/`

アプリケーションの起動のみを担当する。

置いてよいもの：

- config読み込み
- DB接続初期化
- DI
- router起動
- graceful shutdown

置いてはいけないもの：

- handlerの詳細実装
- usecaseの業務ロジック
- SQL
- 認可判断
- 集計計算

### `internal/domain/`

ドメインモデル、ドメインに近い型、repository interfaceを置く。

domainは純粋な層として扱う。

禁止する依存：

- Echo
- GORM
- SQL driver
- Supabase SDK
- HTTP request / response
- 環境変数読み込み
- logger実装

### `internal/domain/model/`

アプリ内部で扱うエンティティや値を置く。

DBタグ、JSONタグ、GORM固有タグを付けない。

API request / response DTOを置かない。

### `internal/domain/repository/`

repository interfaceを置く。

interfaceはusecaseが必要とする操作だけを定義する。

GORM固有型、SQL固有型、HTTP固有型を引数や戻り値に含めない。

### `internal/usecase/`

アプリケーション固有の処理を置く。

usecaseが担当すること：

- 入力値の意味的なバリデーション
- 認証済みuserIDを前提にした認可境界の維持
- repository呼び出しの順序制御
- トランザクション境界の指定
- 残額計算、固定費対象月判定、月次・日次・年次集計
- domain modelとusecase outputの組み立て

usecaseに置いてはいけないもの：

- Echo context
- HTTP status
- request / response DTO
- GORM model
- 生SQL
- loggerへの過剰な直接依存
- 環境変数読み込み

### `internal/infrastructure/`

外部技術の実装詳細を置く。

置いてよいもの：

- DB接続
- GORM model
- repository実装
- transaction実装
- Supabase JWT検証
- JWKS取得
- 外部サービスadapter

infrastructureからdomain repository interfaceを実装する。

infrastructureに置いてはいけないもの：

- HTTP response DTO
- Echo handler
- 画面都合の整形
- 業務判断

### `internal/interface/`

HTTP境界を置く。

置いてよいもの：

- handler
- middleware
- router
- request DTO
- response DTO
- HTTPエラー変換

interfaceに置いてはいけないもの：

- DB操作
- GORM query
- 集計計算
- 業務ロジック
- transactionの中身

### `migrations/`

DB schema変更を置く。

マイグレーションはアプリコードの期待と一致させる。

禁止すること：

- 手元DBだけを手動変更して終わる
- アプリコードだけでDB制約を代替する
- 認可や整合性に必要なunique制約、foreign key、check制約を省く

---

## 配置判断表

実装場所で迷った場合は、以下の表で判断する。

| 置きたいもの | 配置先 | 置いてはいけない場所 |
|---|---|---|
| HTTP request binding | `internal/interface/handler/` | usecase、repository |
| HTTP response整形 | `internal/interface/response/` または handler | domain、repository |
| 認証middleware | `internal/interface/middleware/` | usecase |
| JWT検証の外部通信 | `internal/infrastructure/auth/` | domain、handler |
| アプリuser取得・作成 | middleware + usecase/repository | handler内の直書き |
| 業務バリデーション | usecase | repository |
| request形式の構文バリデーション | handler | repository |
| 残額計算・集計 | usecase | handler、repository |
| DB query | infrastructure repository | handler、usecase |
| repository interface | domain repository | infrastructure |
| GORM model | infrastructure | domain |
| transaction実装 | infrastructure db | handler |
| migration | migrations | Goコードだけ |

判断に迷うものは、より内側の層を外部技術に依存させない場所へ置く。共通化が早すぎる場合は、まず対象usecase配下に置き、2つ以上のusecaseから実利用された時点で共通化を検討する。

---
