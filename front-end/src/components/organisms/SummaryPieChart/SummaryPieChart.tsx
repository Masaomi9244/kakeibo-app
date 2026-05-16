import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { PieMetric } from "@/features/annual-summary/domain/annualSummary";

import {
  getLegendSwatchSx,
  getPieChartSx,
  summaryPieChartStyles,
} from "@/components/organisms/SummaryPieChart/SummaryPieChart.styles";
import { formatYen } from "@/libs/money";

/**
 * 年間収入の使い道円グラフcomponentに渡すprops。
 */
type SummaryPieChartProps = {
  /** 円グラフに表示する指標一覧 */
  readonly metrics: readonly PieMetric[];
  /** 円グラフの見出し */
  readonly title: string;
};

/**
 * @description 年間収入の使い道を円グラフと凡例で表示する。
 * @param props - 円グラフに表示する指標一覧と見出し。
 * @returns 年間収入の使い道円グラフUI。
 * @example
 * <SummaryPieChart metrics={metrics} title="年間収入の使い道" />
 */
export function SummaryPieChart({
  metrics,
  title,
}: SummaryPieChartProps): ReactElement {
  return (
    <Paper variant="outlined" sx={summaryPieChartStyles.root}>
      <Stack spacing={3}>
        <Typography component="h2" sx={summaryPieChartStyles.title} variant="h6">
          {title}
        </Typography>
        <Box sx={summaryPieChartStyles.chartLayout}>
          <Box aria-label={title} role="img" sx={getPieChartSx(metrics)} />
          <Stack spacing={1.5} sx={summaryPieChartStyles.legend}>
            {metrics.map((metric) => (
              <Box key={metric.id} sx={summaryPieChartStyles.legendItem}>
                <Box sx={getLegendSwatchSx(metric.color)} />
                <Box>
                  <Typography sx={summaryPieChartStyles.title}>
                    {metric.label}
                  </Typography>
                  <Box sx={summaryPieChartStyles.valueRow}>
                    <Typography>{formatYen(metric.value)}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {metric.percentage}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
