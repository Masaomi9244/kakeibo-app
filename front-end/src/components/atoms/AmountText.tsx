import type { ReactElement } from "react";

import { Typography } from "@mui/material";

import type { AmountSize, AmountTone } from "@/components/atoms/AmountText.styles";

import {
  amountTextRootSx,
  getAmountColor,
  getAmountVariant,
} from "@/components/atoms/AmountText.styles";
import { formatYen } from "@/libs/money";

/**
 * 金額表示コンポーネントに渡すprops。
 */
type AmountTextProps = {
  readonly amount: number;
  readonly size?: AmountSize;
  readonly tone?: AmountTone;
};

/**
 * @description 金額を家計簿UI共通の色とサイズで表示する。
 * @param props - 表示する金額、サイズ、意味色。
 * @returns 金額テキストUI。
 * @example
 * <AmountText amount={1200} tone="expense" />
 */
export function AmountText({
  amount,
  size = "medium",
  tone = "default",
}: AmountTextProps): ReactElement {
  return (
    <Typography
      component="p"
      variant={getAmountVariant(size)}
      sx={[amountTextRootSx, { color: getAmountColor(tone) }]}
    >
      {formatYen(amount)}
    </Typography>
  );
}
