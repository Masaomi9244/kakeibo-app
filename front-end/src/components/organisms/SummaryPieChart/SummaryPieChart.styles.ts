import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 円グラフstyle生成に渡すセグメント。
 */
type PieChartSegment = {
  /** セグメントの色 */
  readonly color: string;
  /** 円グラフ全体に占める割合 */
  readonly percentage: number;
};

/**
 * 円グラフgradient生成中の累積状態。
 */
type PieGradientBuildState = {
  /** conic-gradientへ渡す各セグメントのstop */
  readonly stops: string[];
  /** すでにgradientへ反映した割合 */
  readonly usedPercentage: number;
};

/**
 * 年間収入の使い道円グラフで利用するstyle定義。
 */
type SummaryPieChartStyles = {
  /** 円グラフ本体 */
  readonly chart: SxProps<Theme>;
  /** 円グラフと凡例の配置 */
  readonly chartLayout: SxProps<Theme>;
  /** 凡例一覧 */
  readonly legend: SxProps<Theme>;
  /** 凡例1行 */
  readonly legendItem: SxProps<Theme>;
  /** 凡例の色見本 */
  readonly legendSwatch: SxProps<Theme>;
  /** カード全体 */
  readonly root: SxProps<Theme>;
  /** 見出し */
  readonly title: SxProps<Theme>;
  /** 金額と割合 */
  readonly valueRow: SxProps<Theme>;
};

/** 円グラフの全体割合。 */
const FULL_PERCENTAGE = 100;

/** データがない時の円グラフ色。 */
const EMPTY_CHART_COLOR = "rgba(100, 116, 139, 0.16)";

/**
 * @description 円グラフのconic-gradientを作成する。
 * @param segments - 円グラフに表示するセグメント一覧。
 * @returns 円グラフ背景に指定するCSS gradient。
 * @example
 * createPieGradient([{ color: "#059669", percentage: 50 }, { color: "#dc2626", percentage: 50 }]);
 */
const createPieGradient = (segments: readonly PieChartSegment[]): string => {
  /** 0より大きい割合を持つセグメント一覧 */
  const visibleSegments = segments.filter((segment) => segment.percentage > 0);

  if (visibleSegments.length === 0) {
    return EMPTY_CHART_COLOR;
  }

  /** 円グラフの開始位置を持ちながら生成したgradient stop一覧 */
  const gradientStops = visibleSegments.reduce<PieGradientBuildState>(
    (result, segment, index) => {
      /** 現在セグメントの開始割合 */
      const start = result.usedPercentage;
      /** 現在セグメントの終了割合 */
      const end =
        index === visibleSegments.length - 1
          ? FULL_PERCENTAGE
          : Math.min(FULL_PERCENTAGE, start + segment.percentage);

      return {
        stops: [...result.stops, `${segment.color} ${start}% ${end}%`],
        usedPercentage: end,
      };
    },
    { stops: [], usedPercentage: 0 },
  );

  return `conic-gradient(${gradientStops.stops.join(", ")})`;
};

/** 年間収入の使い道円グラフで利用するstyle群。 */
export const summaryPieChartStyles = {
  chart: {
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    boxShadow: "inset 0 0 0 1px rgba(15, 23, 42, 0.08)",
    flexShrink: 0,
    width: { sm: 220, xs: 132 },
  },
  chartLayout: {
    alignItems: { md: "flex-start", xs: "center" },
    display: "flex",
    flexDirection: { md: "column", xs: "row" },
    gap: { md: 3, xs: 1.5 },
    justifyContent: "center",
    maxWidth: "100%",
    mx: "auto",
    alignSelf: "center",
    width: "fit-content",
  },
  legend: {
    flex: { md: "unset", xs: "1 1 auto" },
    maxWidth: { md: 320, sm: 260, xs: 190 },
    minWidth: 0,
    width: { md: "100%", xs: "auto" },
  },
  legendItem: {
    alignItems: "center",
    display: "grid",
    gap: { sm: 1.5, xs: 1 },
    gridTemplateColumns: "auto 1fr",
  },
  legendSwatch: {
    borderRadius: "50%",
    height: 12,
    width: 12,
  },
  root: {
    borderRadius: 1,
    p: { sm: 3, xs: 2 },
  },
  title: {
    fontWeight: 700,
  },
  valueRow: {
    alignItems: "baseline",
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
  },
} satisfies SummaryPieChartStyles;

/**
 * @description 円グラフ本体のstyleを作成する。
 * @param segments - 円グラフに表示するセグメント一覧。
 * @returns 円グラフ本体へ渡すsx。
 * @example
 * getPieChartSx([{ color: "#059669", percentage: 50 }]);
 */
export const getPieChartSx = (segments: readonly PieChartSegment[]): SxProps<Theme> => [
  summaryPieChartStyles.chart,
  { background: createPieGradient(segments) },
];

/**
 * @description 凡例色見本のstyleを作成する。
 * @param color - 色見本に表示する色。
 * @returns 凡例色見本へ渡すsx。
 * @example
 * getLegendSwatchSx("#059669");
 */
export const getLegendSwatchSx = (color: string): SxProps<Theme> => [
  summaryPieChartStyles.legendSwatch,
  { bgcolor: color },
];
