import type { TypographyProps } from "@mui/material";

/**
 * 金額表示が使う色の意味。
 */
export type AmountTone = "default" | "expense" | "fixedCost" | "income" | "inverse";

/**
 * 金額表示が使うサイズ段階。
 */
export type AmountSize = "large" | "medium" | "small";

/**
 * 金額テキスト本体に適用するstyle定義。
 */
export type AmountTextRootSx = {
  readonly fontWeight: number;
  readonly letterSpacing: number;
  readonly lineHeight: number;
};

export const amountTextRootSx: AmountTextRootSx = {
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.15,
};

/**
 * @description 金額の意味に応じてMUI theme上の色参照へ変換する。
 * @param tone - 金額が表す意味。
 * @returns MUIのsx colorで利用できるtheme参照。
 * @example
 * getAmountColor("expense");
 */
export const getAmountColor = (tone: AmountTone): string => {
  switch (tone) {
    case "expense":
      return "error.main";
    case "fixedCost":
      return "warning.main";
    case "income":
      return "success.main";
    case "inverse":
      return "common.white";
    case "default":
      return "text.primary";
  }
};

/**
 * @description 金額表示のサイズ指定をTypography variantへ変換する。
 * @param size - 金額表示で使うサイズ段階。
 * @returns MUI Typographyに渡すvariant。
 * @example
 * getAmountVariant("large");
 */
export const getAmountVariant = (size: AmountSize): TypographyProps["variant"] => {
  switch (size) {
    case "large":
      return "h3";
    case "medium":
      return "h4";
    case "small":
      return "h5";
  }
};
