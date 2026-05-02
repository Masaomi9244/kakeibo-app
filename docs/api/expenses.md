# Expenses API

## 出費登録

```txt
POST /api/expenses
```

Request:

```json
{
  "amount": 780
}
```

Response:

```json
{
  "expense": {
    "id": "uuid",
    "amount": 780,
    "spentAt": "2026-05-01T10:30:00+09:00"
  },
  "monthlySummary": {
    "month": "2026-05",
    "availableIncome": 250000,
    "fixedCostTotal": 120000,
    "expenseTotal": 91580,
    "remainingAmount": 38420
  }
}
```

### 仕様

- `amount` は1以上の整数のみ許可する
- `spent_at` はサーバー側の現在日時を使用する
- タイムゾーンは Asia/Tokyo を基準に扱う
- 登録後、対象月のサマリーを返す
- `user_id` はリクエストから受け取らない
- `id` はDB側で生成する

---

## 月別出費取得

```txt
GET /api/expenses?month=2026-05
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "amount": 780,
      "spentAt": "2026-05-01T10:30:00+09:00"
    }
  ]
}
```

### 仕様

- 指定月の出費一覧を取得する
- `month` は `YYYY-MM` 形式とする
- ログインユーザー本人の出費のみ返す
- 該当データがない場合は `items: []` を返す

---

## 日別出費取得

```txt
GET /api/expenses?date=2026-05-01
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "amount": 780,
      "spentAt": "2026-05-01T10:30:00+09:00"
    }
  ]
}
```

### 仕様

- 指定日の出費一覧を取得する
- `date` は `YYYY-MM-DD` 形式とする
- ログインユーザー本人の出費のみ返す
- 該当データがない場合は `items: []` を返す

---

## 出費削除

```txt
DELETE /api/expenses/:id
```

Response:

```json
{
  "message": "削除しました"
}
```

### 仕様

- 指定IDの出費を削除する
- ログインユーザー本人の出費のみ削除できる
- `id + user_id` で削除対象を特定する
