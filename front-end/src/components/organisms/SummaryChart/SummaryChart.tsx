import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

import type { BarMetric } from "@/features/annual-summary/domain/annualSummary";

import { BarMetricColumn } from "@/components/molecules/BarMetricColumn";
import {
  getChartBodySx,
  summaryChartStyles,
} from "@/components/organisms/SummaryChart/SummaryChart.styles";

/**
 * 年間サマリーグラフcomponentに渡すprops。
 */
type SummaryChartProps = {
  /** 初期表示で中央へ寄せる指標ID */
  readonly centerMetricId?: string;
  /** グラフに表示する指標一覧 */
  readonly metrics: readonly BarMetric[];
  /** グラフの見出し */
  readonly title: string;
};

/**
 * @description 年間サマリーの主要指標を棒グラフとして表示する。
 * @param props - 収支内訳グラフに表示する指標。
 * @returns 静的な収支内訳グラフUI。
 * @example
 * <SummaryChart metrics={metrics} title="5月の収支内訳" />
 */
export function SummaryChart({
  centerMetricId,
  metrics,
  title,
}: SummaryChartProps): ReactElement {
  /** 指標列一覧のスクロール領域 */
  const chartBodyRef = useRef<HTMLDivElement | null>(null);
  /** 初期表示で中央へ寄せる指標要素 */
  const centerMetricRef = useRef<HTMLDivElement | null>(null);
  /** 中央寄せ対象の指標index */
  const centerMetricIndex =
    centerMetricId === undefined
      ? -1
      : metrics.findIndex((metric) => metric.id === centerMetricId);
  /** 端の月を端に残し、それ以外の月だけ中央寄せするか */
  const shouldCenterMetric =
    centerMetricIndex > 0 && centerMetricIndex < metrics.length - 1;

  useEffect(() => {
    /** 指標列一覧のスクロール領域 */
    const chartBody = chartBodyRef.current;
    /** 初期表示で中央へ寄せる指標要素 */
    const centerMetric = centerMetricRef.current;

    if (chartBody === null || centerMetric === null || !shouldCenterMetric) {
      return;
    }

    /** 中央寄せ対象を表示領域中央へ置くためのスクロール位置 */
    const scrollLeft =
      centerMetric.offsetLeft -
      chartBody.clientWidth / 2 +
      centerMetric.clientWidth / 2;

    chartBody.scrollLeft = Math.max(scrollLeft, 0);
  }, [centerMetricId, metrics, shouldCenterMetric]);

  return (
    <Paper variant="outlined" sx={summaryChartStyles.root}>
      <Stack spacing={3}>
        <Typography component="h2" sx={summaryChartStyles.title} variant="h6">
          {title}
        </Typography>
        <Box
          data-testid="summary-chart-body"
          ref={chartBodyRef}
          sx={getChartBodySx(shouldCenterMetric)}
        >
          {metrics.map((metric) => (
            <Box
              key={metric.id}
              ref={metric.id === centerMetricId ? centerMetricRef : undefined}
            >
              <BarMetricColumn metric={metric} />
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
