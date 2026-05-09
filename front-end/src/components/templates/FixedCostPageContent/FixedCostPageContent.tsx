import type { ReactElement } from "react";

import { Box, Stack } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { FixedCostForm } from "@/components/organisms/FixedCostForm/FixedCostForm";
import { FixedCostGuide } from "@/components/organisms/FixedCostGuide/FixedCostGuide";
import { FixedCostList } from "@/components/organisms/FixedCostList/FixedCostList";
import { fixedCostPageContentStyles } from "@/components/templates/FixedCostPageContent/FixedCostPageContent.styles";
import { getFixedCostMockData } from "@/features/fixed-costs/usecases/getFixedCostMockData";

/**
 * @description 固定費管理画面の静的モック全体を表示する。
 * @param なし
 * @returns 固定費管理画面のコンテンツUI。
 * @example
 * <FixedCostPageContent />
 */
export function FixedCostPageContent(): ReactElement {
  /** 固定費画面に表示する固定費一覧 */
  const fixedCosts = getFixedCostMockData();
  /** 予算計算に含まれる固定費合計 */
  const activeFixedCostTotal = fixedCosts.reduce(
    (total, fixedCost) => total + (fixedCost.isActive ? fixedCost.amount : 0),
    0,
  );
  /** 固定費一覧の全件合計 */
  const fixedCostTotal = fixedCosts.reduce(
    (total, fixedCost) => total + fixedCost.amount,
    0,
  );
  /** 固定費一覧の件数表示 */
  const fixedCostCountLabel = `${fixedCosts.length}件の固定費`;

  return (
    <Stack spacing={3}>
      <PageHeader subtitle="毎月の固定費を管理する" title="固定費管理" />
      <FixedCostGuide />
      <Box sx={fixedCostPageContentStyles.statGrid}>
        <StatCard
          amount={activeFixedCostTotal}
          label="今月の固定費"
          subtitle={fixedCostCountLabel}
          tone="fixedCost"
        />
        <StatCard
          amount={fixedCostTotal}
          label="全固定費の合計"
          subtitle={fixedCostCountLabel}
        />
      </Box>
      <FixedCostForm />
      <FixedCostList fixedCosts={fixedCosts} />
    </Stack>
  );
}
