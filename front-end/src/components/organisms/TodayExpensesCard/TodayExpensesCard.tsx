import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { Expense } from "@/domains/expense";

import { AmountText } from "@/components/atoms/AmountText";
import { todayExpensesCardStyles } from "@/components/organisms/TodayExpensesCard/TodayExpensesCard.styles";
import { formatAsiaTokyoTime } from "@/libs/date";
import { formatYen } from "@/libs/money";

/**
 * 今日の出費カードに渡すprops。
 */
type TodayExpensesCardProps = {
  /** 出費 */
  readonly expenses: readonly Expense[];
  /** ローディング中か */
  readonly isLoading: boolean;
  /** 合計金額 */
  readonly total: number;
};

/**
 * @description 今日の出費一覧と合計金額を表示する。
 * @param props - 表示する出費一覧と合計金額。
 * @returns 今日の出費カードUI。
 * @example
 * <TodayExpensesCard expenses={expenses} isLoading={false} total={2140} />
 */
export function TodayExpensesCard({
  expenses,
  isLoading,
  total,
}: TodayExpensesCardProps): ReactElement {
  return (
    <Paper variant="outlined" sx={todayExpensesCardStyles.root}>
      <Stack spacing={0} sx={todayExpensesCardStyles.header}>
        <Typography component="h2" sx={todayExpensesCardStyles.heading} variant="h6">
          今日の出費
        </Typography>
      </Stack>
      <Stack spacing={1.5} sx={todayExpensesCardStyles.list}>
        {isLoading ? (
          <Typography color="text.secondary">読み込み中です</Typography>
        ) : null}
        {!isLoading && expenses.length === 0 ? (
          <Typography color="text.secondary">今日の出費はまだありません</Typography>
        ) : null}
        {expenses.map((expense) => (
          <Box key={expense.id} sx={todayExpensesCardStyles.item}>
            <Typography color="text.secondary">
              {formatAsiaTokyoTime(expense.spentAt)}
            </Typography>
            <Typography sx={todayExpensesCardStyles.heading} variant="h6">
              {formatYen(expense.amount)}
            </Typography>
          </Box>
        ))}
        <Box sx={todayExpensesCardStyles.total}>
          <Typography color="text.secondary">今日の合計</Typography>
          <AmountText amount={total} size="small" tone="expense" />
        </Box>
      </Stack>
    </Paper>
  );
}
