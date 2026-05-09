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

/** 棒グラフの高さ計算に使う最大金額。 */
const maxBarAmount = 315_000;

/**
 * @description 年間サマリーの1指標を縦棒として表示する。
 * @param props - 表示する指標。
 * @returns 棒グラフの1列UI。
 * @example
 * <BarMetricColumn metric={metric} />
 */
export function BarMetricColumn({ metric }: BarMetricColumnProps): ReactElement {
  /** 指標金額から算出した棒の高さ */
  const height = Math.max(6, Math.round((metric.value / maxBarAmount) * 180));

  return (
    <Stack spacing={1} sx={barMetricColumnStyles.root}>
      <Box sx={barMetricColumnStyles.barArea}>
        <Box sx={getBarSx(metric.color, height)} />
      </Box>
      <Typography sx={barMetricColumnStyles.label} variant="body2">
        {metric.label}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {formatYen(metric.value)}
      </Typography>
    </Stack>
  );
}
