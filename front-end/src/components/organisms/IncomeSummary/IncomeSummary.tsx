import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";
import { StatCard } from "@/components/molecules/StatCard";
import { incomeSummaryStyles } from "@/components/organisms/IncomeSummary/IncomeSummary.styles";

/**
 * 収入サマリーcomponentに渡すprops。
 */
type IncomeSummaryProps = {
  /** 予算に含まれる収入合計 */
  readonly includedIncome: number;
  /** 今月の総収入 */
  readonly totalIncome: number;
};

/**
 * @description 収入管理画面の総収入と予算対象収入を表示する。
 * @param props - 収入サマリーに表示する金額。
 * @returns 収入サマリーUI。
 * @example
 * <IncomeSummary totalIncome={315000} includedIncome={315000} />
 */
export function IncomeSummary({
  includedIncome,
  totalIncome,
}: IncomeSummaryProps): ReactElement {
  return (
    <Box sx={incomeSummaryStyles.summaryGrid}>
      <Paper sx={incomeSummaryStyles.incomeHero}>
        <Stack spacing={1.5}>
          <Typography sx={incomeSummaryStyles.incomeHeroLabel}>今月の総収入</Typography>
          <AmountText amount={totalIncome} size="medium" tone="inverse" />
        </Stack>
      </Paper>
      <StatCard amount={includedIncome} label="予算に含まれる収入" tone="income" />
    </Box>
  );
}
