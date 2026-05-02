# Fixed Costs API

## 固定費登録

```txt
POST /api/fixed-costs
```

Request:

```json
{
  "name": "家賃",
  "amount": 80000,
  "startMonth": "2026-05-01",
  "isActive": true
}
```

Response:

```json
{
  "fixedCost": {
    "id": "uuid",
    "name": "家賃",
    "amount": 80000,
    "startMonth": "2026-05-01",
    "isActive": true
  }
}
```

### 仕様

- `name` は必須
- `amount` は1以上の整数のみ許可する
- `startMonth` は月初日に正規化する
- `isActive = true` の固定費のみ計算対象とする
- `user_id` はリクエストから受け取らない
- `id` はDB側で生成する

---

## 対象月の固定費取得

```txt
GET /api/fixed-costs?month=2026-05
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "家賃",
      "amount": 80000,
      "startMonth": "2026-05-01",
      "isActive": true
    }
  ]
}
```

### 仕様

- 対象月が `start_month` 以降、かつ `is_active = true` の固定費を返す
- ログインユーザー本人の固定費のみ返す
- 該当データがない場合は `items: []` を返す

---

## 固定費更新

```txt
PUT /api/fixed-costs/:id
```

Request:

```json
{
  "name": "家賃",
  "amount": 85000,
  "startMonth": "2026-05-01",
  "isActive": true
}
```

Response:

```json
{
  "fixedCost": {
    "id": "uuid",
    "name": "家賃",
    "amount": 85000,
    "startMonth": "2026-05-01",
    "isActive": true
  }
}
```

### 仕様

- 指定IDの固定費を更新する
- ログインユーザー本人の固定費のみ更新できる
- `id + user_id` で更新対象を特定する

---

## 固定費削除

```txt
DELETE /api/fixed-costs/:id
```

Response:

```json
{
  "message": "削除しました"
}
```

### 仕様

- 指定IDの固定費を削除する
- ログインユーザー本人の固定費のみ削除できる
- `id + user_id` で削除対象を特定する
