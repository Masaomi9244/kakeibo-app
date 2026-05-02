# Monthly Summary API

```txt
GET /api/monthly-summary?month=2026-05
```

Response:

```json
{
  "monthlySummary": {
    "month": "2026-05",
    "totalIncome": 550000,
    "availableIncome": 250000,
    "reservedIncome": 300000,
    "fixedCostTotal": 95000,
    "expenseTotal": 50000,
    "remainingAmount": 105000,
    "actualBalance": 405000
  }
}
```

## 計算式

```txt
totalIncome
= 対象月の全収入合計

availableIncome
= 対象月の included_in_balance = true の収入合計

reservedIncome
= 対象月の included_in_balance = false の収入合計

fixedCostTotal
= 対象月に有効な固定費合計

expenseTotal
= 対象月の出費合計

remainingAmount
= availableIncome - fixedCostTotal - expenseTotal

actualBalance
= totalIncome - fixedCostTotal - expenseTotal
```
