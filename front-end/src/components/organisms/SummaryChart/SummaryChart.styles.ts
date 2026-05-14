import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 年間サマリーグラフで利用するstyle定義。
 */
type SummaryChartStyles = {
  /** 中央寄せ用の左右余白を持つ指標列一覧 */
  readonly centeredChartBody: SxProps<Theme>;
  /** 指標列一覧 */
  readonly chartBody: SxProps<Theme>;
  /** グラフカード全体 */
  readonly root: SxProps<Theme>;
  /** 見出し */
  readonly title: SxProps<Theme>;
};

/** 年間サマリーグラフで利用するstyle群。 */
export const summaryChartStyles = {
  centeredChartBody: {
    px: "max(0px, calc(50% - 36px))",
  },
  chartBody: {
    display: "flex",
    gap: 2,
    overflowX: "auto",
    pb: 1,
  },
  root: {
    borderRadius: 1,
    p: { sm: 3, xs: 2 },
  },
  title: {
    fontWeight: 700,
  },
} satisfies SummaryChartStyles;

/**
 * @description 指標列一覧のstyleを作成する。
 * @param shouldCenterMetric - 中央寄せ用の左右余白を持つか。
 * @returns 指標列一覧へ渡すsx。
 * @example
 * getChartBodySx(true);
 */
export const getChartBodySx = (shouldCenterMetric: boolean): SxProps<Theme> => [
  summaryChartStyles.chartBody,
  shouldCenterMetric ? summaryChartStyles.centeredChartBody : {},
];
