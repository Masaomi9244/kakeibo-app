import type { ReactElement } from "react";

import { AmountHeroCard } from "@/components/molecules/AmountHeroCard";

/**
 * 予算ヒーローcomponentに渡すprops。
 */
type BudgetHeroProps = {
  /** 今月の残り予算 */
  readonly remainingAmount: number;
};

/**
 * @description ホーム画面で今月の残り予算を強調表示する。
 * @param props - 残り予算。
 * @returns 予算サマリーのヒーローUI。
 * @example
 * <BudgetHero remainingAmount={213840} />
 */
export function BudgetHero({ remainingAmount }: BudgetHeroProps): ReactElement {
  return <AmountHeroCard amount={remainingAmount} label="今月の残り予算" />;
}
