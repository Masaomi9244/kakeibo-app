import type { ReactElement } from "react";

import { Box, Button, Collapse, Stack } from "@mui/material";

import { StatCard } from "@/components/molecules/StatCard";
import { homeSummaryCardsStyles } from "@/components/organisms/HomeSummaryCards/HomeSummaryCards.styles";

/**
 * ホーム画面の収支カード一覧に渡すprops。
 */
export type HomeSummaryCardsProps = {
  /** 収入 */
  readonly availableIncome: number;
  /** 出費 */
  readonly expenseTotal: number;
  /** 固定費 */
  readonly fixedCostTotal: number;
  /** SP幅で収支カードを展開中か */
  readonly isExpanded: boolean;
  /** SP幅で収支カードの表示を切り替える処理 */
  readonly onToggle: () => void;
};

/**
 * @description ホーム画面の収入、固定費、出費カードをPCでは常時表示し、SPでは開閉表示する。
 * @param props - 収支金額とSP開閉状態。
 * @returns ホーム画面の収支カード一覧UI。
 * @example
 * <HomeSummaryCards availableIncome={315000} expenseTotal={5960} fixedCostTotal={95200} isExpanded={false} onToggle={handleToggle} />
 */
export function HomeSummaryCards({
  availableIncome,
  expenseTotal,
  fixedCostTotal,
  isExpanded,
  onToggle,
}: HomeSummaryCardsProps): ReactElement {
  /** SP幅の収支カード開閉ボタンに表示する文言 */
  const toggleLabel = isExpanded ? "収支内訳を閉じる" : "収支内訳を表示";

  return (
    <Stack spacing={0}>
      <Button
        aria-expanded={isExpanded}
        onClick={onToggle}
        size="small"
        sx={homeSummaryCardsStyles.toggleButton}
        variant="outlined"
      >
        {toggleLabel}
      </Button>
      <Box sx={homeSummaryCardsStyles.desktopGrid}>
        <StatCard amount={availableIncome} label="収入" tone="income" />
        <StatCard amount={fixedCostTotal} label="固定費" tone="fixedCost" />
        <StatCard amount={expenseTotal} label="出費" tone="expense" />
      </Box>
      <Collapse in={isExpanded} sx={homeSummaryCardsStyles.mobileCollapse}>
        <Box sx={homeSummaryCardsStyles.mobileGrid}>
          <StatCard amount={availableIncome} label="収入" tone="income" />
          <StatCard amount={fixedCostTotal} label="固定費" tone="fixedCost" />
          <StatCard amount={expenseTotal} label="出費" tone="expense" />
        </Box>
      </Collapse>
    </Stack>
  );
}
