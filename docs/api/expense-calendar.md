# Expense Calendar API

```txt
GET /api/expense-calendar?month=2026-05
```

Response:

```json
{
  "expenseCalendar": {
    "month": "2026-05",
    "availableIncome": 250000,
    "fixedCostTotal": 95000,
    "days": [
      {
        "date": "2026-05-01",
        "expenseTotal": 2140,
        "remainingAmount": 152860
      },
      {
        "date": "2026-05-02",
        "expenseTotal": 800,
        "remainingAmount": 152060
      }
    ]
  }
}
```

## 日別残額の計算式

```txt
その日終了時点の残額
= 対象月の使える収入合計
- 対象月の固定費合計
- 月初からその日までの出費合計
```

## 補足

MVPではバックエンドが対象月の日別データを返す方針とする。

出費が0円の日も、カレンダー表示に必要な日付は返す。

フロントエンド側では、バックエンドから返されたdaysをそのまま表示し、自前グリッドのセルに紐づける。
