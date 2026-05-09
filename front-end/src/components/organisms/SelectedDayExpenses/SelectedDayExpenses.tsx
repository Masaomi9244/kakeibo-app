import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { SelectedExpense } from "@/features/calendar/domain/calendar";

import { selectedDayExpensesStyles } from "@/components/organisms/SelectedDayExpenses/SelectedDayExpenses.styles";
import { formatYen } from "@/libs/money";

/**
 * 選択日の出費一覧componentに渡すprops。
 */
type SelectedDayExpensesProps = {
  /** 選択日の出費一覧 */
  readonly expenses: readonly SelectedExpense[];
  /** 選択日の表示ラベル */
  readonly selectedDateLabel: string;
  /** 選択日の出費合計 */
  readonly total: number;
};

/**
 * @description 選択日の支出合計と支出一覧を表示する。
 * @param props - 選択日の出費一覧と合計金額。
 * @returns 選択日の支出一覧UI。
 * @example
 * <SelectedDayExpenses expenses={expenses} selectedDateLabel="2026年5月6日" total={2140} />
 */
export function SelectedDayExpenses({
  expenses,
  selectedDateLabel,
  total,
}: SelectedDayExpensesProps): ReactElement {
  return (
    <Paper variant="outlined" sx={selectedDayExpensesStyles.root}>
      <Box sx={selectedDayExpensesStyles.header}>
        <Typography component="h2" sx={selectedDayExpensesStyles.value} variant="h6">
          {selectedDateLabel}の支出
        </Typography>
      </Box>
      <Box sx={selectedDayExpensesStyles.amountSummary}>
        <Typography color="text.secondary" variant="body2">
          合計
        </Typography>
        <Typography
          color="error.main"
          sx={selectedDayExpensesStyles.value}
          variant="h6"
        >
          {formatYen(total)}
        </Typography>
      </Box>
      <Stack divider={<Box sx={selectedDayExpensesStyles.divider} />}>
        {expenses.map((expense) => (
          <Box key={expense.id} sx={selectedDayExpensesStyles.item}>
            <Typography color="text.secondary">{expense.time}</Typography>
            <Typography sx={selectedDayExpensesStyles.value}>
              {formatYen(expense.amount)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
