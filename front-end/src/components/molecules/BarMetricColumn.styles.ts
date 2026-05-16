import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 棒グラフ指標列で利用するstyle定義。
 */
type BarMetricColumnStyles = {
  /** 棒グラフの表示領域 */
  readonly barArea: SxProps<Theme>;
  /** 指標ラベル */
  readonly label: SxProps<Theme>;
  /** 指標列全体 */
  readonly root: SxProps<Theme>;
  /** 指標金額 */
  readonly value: SxProps<Theme>;
};

/** 棒グラフ指標列で利用するstyle群。 */
export const barMetricColumnStyles = {
  barArea: {
    alignItems: "flex-end",
    display: "flex",
    height: { md: 168, xs: 136 },
    justifyContent: "center",
  },
  label: {
    fontSize: { sm: "0.875rem", xs: "0.75rem" },
    fontWeight: 700,
  },
  root: {
    alignItems: "center",
    minWidth: 0,
  },
  value: {
    fontSize: { sm: "0.875rem", xs: "0.7rem" },
    textAlign: "center",
  },
} satisfies BarMetricColumnStyles;

/**
 * @description 指標の金額と色に応じた棒styleを作成する。
 * @param color - 棒の色。
 * @param height - 棒の高さ。
 * @returns 棒本体へ渡すsx。
 * @example
 * getBarSx("#059669", 120);
 */
export const getBarSx = (color: string, height: number): SxProps<Theme> => ({
  bgcolor: color,
  borderRadius: "8px 8px 0 0",
  height,
  maxWidth: 32,
  minWidth: { sm: 16, xs: 10 },
  width: "100%",
});
