import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { BarMetric } from "@/features/annual-summary/domain/annualSummary";

import { BarMetricColumn } from "@/components/molecules/BarMetricColumn";
import {
  getChartBodySx,
  getChartItemSx,
  summaryChartStyles,
} from "@/components/organisms/SummaryChart/SummaryChart.styles";

/**
 * 年間サマリーグラフcomponentに渡すprops。
 */
type SummaryChartProps = {
  /** グラフに表示する指標一覧 */
  readonly metrics: readonly BarMetric[];
  /** グラフの見出し */
  readonly title: string;
};

/**
 * @description 年間サマリーの主要指標を棒グラフとして表示する。
 * @param props - 月別推移グラフに表示する指標。
 * @returns 静的な収支内訳グラフUI。
 * @example
 * <SummaryChart metrics={metrics} title="5月の収支内訳" />
 */
export function SummaryChart({ metrics, title }: SummaryChartProps): ReactElement {
  return (
    <Paper variant="outlined" sx={summaryChartStyles.root}>
      <Stack spacing={3}>
        <Typography component="h2" sx={summaryChartStyles.title} variant="h6">
          {title}
        </Typography>
        <Box data-testid="summary-chart-body" sx={getChartBodySx()}>
          {metrics.map((metric) => (
            <Box key={metric.id} sx={getChartItemSx()}>
              <BarMetricColumn metric={metric} />
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
