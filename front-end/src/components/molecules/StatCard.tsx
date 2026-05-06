import type { ReactElement } from "react";

import { Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";

/**
 * 統計カードで使う金額の意味色。
 */
type StatTone = "default" | "expense" | "fixedCost" | "income";

/**
 * 統計カードコンポーネントに渡すprops。
 */
type StatCardProps = {
  readonly amount: number;
  readonly label: string;
  readonly subtitle?: string;
  readonly tone?: StatTone;
};

/**
 * @description サマリー金額をラベル付きカードとして表示する。
 * @param props - 表示する金額、ラベル、補足、金額の意味色。
 * @returns 統計カードUI。
 * @example
 * <StatCard label="今月の支出" amount={5960} tone="expense" />
 */
export function StatCard({
  amount,
  label,
  subtitle,
  tone = "default",
}: StatCardProps): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        minHeight: 104,
        p: 2,
      }}
    >
      <Stack spacing={0.75}>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
        <AmountText amount={amount} size="small" tone={tone} />
        {subtitle !== undefined && (
          <Typography color="text.secondary" variant="body2">
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
