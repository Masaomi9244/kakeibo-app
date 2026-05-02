# Incomes API

## 収入登録

```txt
POST /api/incomes
```

Request:

```json
{
  "amount": 250000,
  "incomeDate": "2026-05-25",
  "memo": "給料",
  "includedInBalance": true
}
```

Response:

```json
{
  "income": {
    "id": "uuid",
    "amount": 250000,
    "incomeDate": "2026-05-25",
    "memo": "給料",
    "includedInBalance": true
  }
}
```

### 仕様

- `amount` は1以上の整数のみ許可する
- `incomeDate` は `YYYY-MM-DD` 形式とする
- `memo` は任意
- `includedInBalance = true` の収入のみ残額計算に含める
- `user_id` はリクエストから受け取らない
- `id` はDB側で生成する

---

## 月別収入取得

```txt
GET /api/incomes?month=2026-05
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "amount": 250000,
      "incomeDate": "2026-05-25",
      "memo": "給料",
      "includedInBalance": true
    }
  ]
}
```

### 仕様

- 指定月の収入一覧を取得する
- `month` は `YYYY-MM` 形式とする
- ログインユーザー本人の収入のみ返す
- 該当データがない場合は `items: []` を返す

---

## 収入更新

```txt
PUT /api/incomes/:id
```

Request:

```json
{
  "amount": 260000,
  "incomeDate": "2026-05-25",
  "memo": "給料",
  "includedInBalance": true
}
```

Response:

```json
{
  "income": {
    "id": "uuid",
    "amount": 260000,
    "incomeDate": "2026-05-25",
    "memo": "給料",
    "includedInBalance": true
  }
}
```

### 仕様

- 指定IDの収入を更新する
- ログインユーザー本人の収入のみ更新できる
- `id + user_id` で更新対象を特定する

---

## 収入削除

```txt
DELETE /api/incomes/:id
```

Response:

```json
{
  "message": "削除しました"
}
```

### 仕様

- 指定IDの収入を削除する
- ログインユーザー本人の収入のみ削除できる
- `id + user_id` で削除対象を特定する
