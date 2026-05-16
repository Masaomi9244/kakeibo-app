import type { ReactElement } from "react";

import { Box, Stack, Typography } from "@mui/material";

import type { BarMetric } from "@/features/annual-summary/domain/annualSummary";

import {
  barMetricColumnStyles,
  getBarSx,
} from "@/components/molecules/BarMetricColumn.styles";
import { formatYen } from "@/libs/money";

/**
 * 棒グラフの1指標列コンポーネントに渡すprops。
 */
type BarMetricColumnProps = {
  /** 表示する指標 */
  readonly metric: BarMetric;
};

/**
 * @description 年間サマリーの1指標を縦棒として表示する。
 * @param props - 表示する指標。
 * @returns 棒グラフの1列UI。
 * @example
 * <BarMetricColumn metric={metric} />
 */
export function BarMetricColumn({ metric }: BarMetricColumnProps): ReactElement {
  return (
    <Stack spacing={1} sx={barMetricColumnStyles.root}>
      <Box sx={barMetricColumnStyles.barArea}>
        <Box sx={getBarSx(metric.color, metric.height)} />
      </Box>
      <Typography sx={barMetricColumnStyles.label} variant="body2">
        {metric.label}
      </Typography>
      <Typography
        color="text.secondary"
        sx={barMetricColumnStyles.value}
        variant="body2"
      >
        {formatYen(metric.value)}
      </Typography>
    </Stack>
  );
}
