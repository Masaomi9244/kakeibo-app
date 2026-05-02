# Annual Summary API

```txt
GET /api/annual-summary?year=2026
```

Response:

```json
{
  "annualSummary": {
    "year": 2026,
    "totalIncome": 4800000,
    "availableIncome": 3600000,
    "reservedIncome": 1200000,
    "fixedCostTotal": 1440000,
    "expenseTotal": 1200000,
    "actualBalance": 2160000,
    "availableBalance": 960000,
    "months": [
      {
        "month": "2026-01",
        "totalIncome": 300000,
        "availableIncome": 300000,
        "reservedIncome": 0,
        "fixedCostTotal": 120000,
        "expenseTotal": 100000,
        "actualBalance": 80000,
        "availableBalance": 80000
      }
    ]
  }
}
```

## 計算式

```txt
年間全収入
= その年に登録された全収入

年間使える収入
= included_in_balance = true の収入合計

年間貯める収入
= included_in_balance = false の収入合計

年間固定費
= 各月の対象固定費合計の年間合計

年間出費
= その年に登録された出費合計

年間実収支
= 年間全収入 - 年間固定費 - 年間出費

年間生活費残り
= 年間使える収入 - 年間固定費 - 年間出費
```
