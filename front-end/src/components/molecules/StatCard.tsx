import type { ReactElement } from "react";

import { Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";
import { statCardStyles } from "@/components/molecules/StatCard.styles";

/**
 * 統計カードで使う金額の意味色。
 */
type StatTone = "default" | "expense" | "fixedCost" | "income";

/**
 * 統計カードコンポーネントに渡すprops。
 */
type StatCardProps = {
  /** 統計カードで強調する金額 */
  readonly amount: number;
  /** 統計カードを重要指標として背景強調するか */
  readonly emphasized?: boolean;
  /** 金額の上に表示するラベル */
  readonly label: string;
  /** 金額の下に表示する補足テキスト */
  readonly subtitle?: string;
  /** 金額が表す意味色 */
  readonly tone?: StatTone;
};

/**
 * @description サマリー金額をラベル付きカードとして表示する。
 * @param props - 表示する金額、ラベル、補足、金額の意味色。
 * @returns 統計カードUI。
 * @example
 * <StatCard label="今月の支出" amount={5960} tone="expense" />
 */
export function StatCard({
  amount,
  emphasized = false,
  label,
  subtitle,
  tone = "default",
}: StatCardProps): ReactElement {
  /** 統計カードの強調状態を反映したstyle */
  const rootSx = emphasized
    ? [statCardStyles.root, statCardStyles.emphasizedRoot]
    : statCardStyles.root;

  return (
    <Paper variant="outlined" sx={rootSx}>
      <Stack spacing={0.75}>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
        <AmountText amount={amount} size="small" tone={tone} />
        {subtitle !== undefined && (
          <Typography color="text.secondary" variant="body2">
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
