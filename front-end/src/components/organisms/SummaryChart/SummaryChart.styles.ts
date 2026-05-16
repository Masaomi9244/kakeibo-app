import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 年間サマリーグラフで利用するstyle定義。
 */
type SummaryChartStyles = {
  /** 指標列一覧 */
  readonly chartBody: SxProps<Theme>;
  /** 指標1列分のラッパー */
  readonly chartItem: SxProps<Theme>;
  /** グラフカード全体 */
  readonly root: SxProps<Theme>;
  /** 見出し */
  readonly title: SxProps<Theme>;
};

/** 年間サマリーグラフで利用するstyle群。 */
export const summaryChartStyles = {
  chartBody: {
    columnGap: { sm: 1.5, xs: 0.75 },
    display: { md: "grid", xs: "flex" },
    gap: { sm: 1.5, xs: 1.25 },
    gridTemplateColumns: { md: "repeat(12, minmax(0, 1fr))" },
    overflowX: { md: "visible", xs: "auto" },
    rowGap: 0,
    scrollSnapType: { xs: "x proximity" },
    scrollbarWidth: "thin",
    pb: 1,
  },
  chartItem: {
    flex: { md: "unset", xs: "0 0 56px" },
    minWidth: { md: 0, xs: 56 },
    scrollSnapAlign: { xs: "start" },
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
 * @param なし。
 * @returns 指標列一覧へ渡すsx。
 * @example
 * getChartBodySx();
 */
export const getChartBodySx = (): SxProps<Theme> => summaryChartStyles.chartBody;

/**
 * @description 指標1列分のラッパーstyleを返す。
 * @param なし。
 * @returns 指標1列分へ渡すsx。
 * @example
 * getChartItemSx();
 */
export const getChartItemSx = (): SxProps<Theme> => summaryChartStyles.chartItem;
