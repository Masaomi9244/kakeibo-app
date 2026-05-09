import type { ReactElement } from "react";

import { Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";
import { budgetHeroStyles } from "@/components/organisms/BudgetHero/BudgetHero.styles";
import { formatYen } from "@/libs/money";

/**
 * 予算ヒーローcomponentに渡すprops。
 */
type BudgetHeroProps = {
  /** 今日使える目安 */
  readonly dailySpendingGuide: number;
  /** 今月の残り予算 */
  readonly remainingAmount: number;
};

/**
 * @description ホーム画面で今月の残り予算と今日使える目安を強調表示する。
 * @param props - 残り予算と今日使える目安。
 * @returns 予算サマリーのヒーローUI。
 * @example
 * <BudgetHero remainingAmount={213840} dailySpendingGuide={7920} />
 */
export function BudgetHero({
  dailySpendingGuide,
  remainingAmount,
}: BudgetHeroProps): ReactElement {
  return (
    <Paper elevation={5} sx={budgetHeroStyles.root}>
      <Stack spacing={2.5}>
        <Typography sx={budgetHeroStyles.label}>今月の残り予算</Typography>
        <AmountText amount={remainingAmount} size="large" tone="inverse" />
        <Stack direction="row" spacing={2} sx={budgetHeroStyles.footer}>
          <Typography sx={budgetHeroStyles.label}>今日使える目安</Typography>
          <Typography component="p" sx={budgetHeroStyles.label} variant="h5">
            {formatYen(dailySpendingGuide)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
