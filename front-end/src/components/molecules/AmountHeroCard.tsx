import type { ReactElement } from "react";

import { Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";
import { amountHeroCardStyles } from "@/components/molecules/AmountHeroCard.styles";

/**
 * 金額ヒーローカードcomponentに渡すprops。
 */
type AmountHeroCardProps = {
  /** 強調表示する金額 */
  readonly amount: number;
  /** 金額の上に表示するラベル */
  readonly label: string;
};

/**
 * @description 画面内で最も強調したい金額をヒーローカードとして表示する。
 * @param props - 強調表示する金額とラベル。
 * @returns 金額ヒーローカードUI。
 * @example
 * <AmountHeroCard label="今月の残り予算" amount={213840} />
 */
export function AmountHeroCard({ amount, label }: AmountHeroCardProps): ReactElement {
  return (
    <Paper elevation={5} sx={amountHeroCardStyles.root}>
      <Stack spacing={2.5}>
        <Typography sx={amountHeroCardStyles.label}>{label}</Typography>
        <AmountText amount={amount} size="large" tone="inverse" />
      </Stack>
    </Paper>
  );
}
