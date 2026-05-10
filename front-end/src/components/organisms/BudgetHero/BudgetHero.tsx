import type { ReactElement } from "react";

import { Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";
import { budgetHeroStyles } from "@/components/organisms/BudgetHero/BudgetHero.styles";

/**
 * 予算ヒーローcomponentに渡すprops。
 */
type BudgetHeroProps = {
  /** 今月の残り予算 */
  readonly remainingAmount: number;
};

/**
 * @description ホーム画面で今月の残り予算を強調表示する。
 * @param props - 残り予算。
 * @returns 予算サマリーのヒーローUI。
 * @example
 * <BudgetHero remainingAmount={213840} />
 */
export function BudgetHero({ remainingAmount }: BudgetHeroProps): ReactElement {
  return (
    <Paper elevation={5} sx={budgetHeroStyles.root}>
      <Stack spacing={2.5}>
        <Typography sx={budgetHeroStyles.label}>今月の残り予算</Typography>
        <AmountText amount={remainingAmount} size="large" tone="inverse" />
      </Stack>
    </Paper>
  );
}
