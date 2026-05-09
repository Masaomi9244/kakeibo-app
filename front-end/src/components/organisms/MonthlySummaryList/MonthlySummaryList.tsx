import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { AnnualMonthlySummary } from "@/features/annual-summary/domain/annualSummary";

import { monthlySummaryListStyles } from "@/components/organisms/MonthlySummaryList/MonthlySummaryList.styles";
import { formatYen } from "@/libs/money";

/**
 * 月別サマリー一覧componentに渡すprops。
 */
type MonthlySummaryListProps = {
  /** 月別サマリー一覧 */
  readonly summaries: readonly AnnualMonthlySummary[];
};

/**
 * @description 月別の収入、固定費、出費、残り金額を一覧表示する。
 * @param props - 月別サマリー一覧。
 * @returns 月別サマリー一覧UI。
 * @example
 * <MonthlySummaryList summaries={summaries} />
 */
export function MonthlySummaryList({
  summaries,
}: MonthlySummaryListProps): ReactElement {
  return (
    <Paper variant="outlined" sx={monthlySummaryListStyles.root}>
      <Box sx={monthlySummaryListStyles.header}>
        <Typography
          component="h2"
          sx={monthlySummaryListStyles.strongText}
          variant="h6"
        >
          月別サマリー一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={monthlySummaryListStyles.divider} />}>
        {summaries.map((summary) => (
          <Box key={summary.month} sx={monthlySummaryListStyles.row}>
            <Typography sx={monthlySummaryListStyles.strongText}>
              {summary.month}
            </Typography>
            <Typography color="success.main">
              {formatYen(summary.totalIncome)}
            </Typography>
            <Typography color="success.main">
              {formatYen(summary.availableIncome)}
            </Typography>
            <Typography>{formatYen(summary.reservedIncome)}</Typography>
            <Typography color="warning.main">{formatYen(summary.fixedCost)}</Typography>
            <Typography color="error.main">{formatYen(summary.expense)}</Typography>
            <Typography>{formatYen(summary.remainingBalance)}</Typography>
            <Typography>{formatYen(summary.actualBalance)}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
