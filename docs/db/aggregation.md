# DB Aggregation

## 月次サマリー

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

---

## 日別残額

```txt
その日終了時点の残額
= 対象月の使える収入合計
- 対象月の固定費合計
- 月初からその日までの出費合計
```

---

## 年間サマリー

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

---

## 日付・タイムゾーン

- 表示・集計の基準タイムゾーンは Asia/Tokyo とする
- `spent_at` は `timestamptz` で保存する
- `income_date` は `date` で保存する
- `start_month` は `date` で保存し、必ず月初日を入れる
- 月単位の検索では、対象月の月初以上、翌月月初未満で検索する

```txt
2026年5月の検索範囲
2026-05-01 00:00:00 以上
2026-06-01 00:00:00 未満
```

月次集計では、DBサーバーのローカルタイムゾーンに依存した検索をしない。
