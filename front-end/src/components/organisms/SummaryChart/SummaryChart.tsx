import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { BarMetric } from "@/features/annual-summary/domain/annualSummary";

import { BarMetricColumn } from "@/components/molecules/BarMetricColumn";
import { summaryChartStyles } from "@/components/organisms/SummaryChart/SummaryChart.styles";

/**
 * 年間サマリーグラフcomponentに渡すprops。
 */
type SummaryChartProps = {
  /** グラフに表示する指標一覧 */
  readonly metrics: readonly BarMetric[];
};

/**
 * @description 年間サマリーの主要指標を棒グラフとして表示する。
 * @param props - 収支内訳グラフに表示する指標。
 * @returns 静的な収支内訳グラフUI。
 * @example
 * <SummaryChart metrics={metrics} />
 */
export function SummaryChart({ metrics }: SummaryChartProps): ReactElement {
  return (
    <Paper variant="outlined" sx={summaryChartStyles.root}>
      <Stack spacing={3}>
        <Typography component="h2" sx={summaryChartStyles.title} variant="h6">
          5月の収支内訳
        </Typography>
        <Box sx={summaryChartStyles.chartBody}>
          {metrics.map((metric) => (
            <BarMetricColumn key={metric.id} metric={metric} />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
