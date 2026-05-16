import type { ReactElement } from "react";

import { AmountHeroCard } from "@/components/molecules/AmountHeroCard";

/**
 * 収入サマリーcomponentに渡すprops。
 */
type IncomeSummaryProps = {
  /** 今月の総収入 */
  readonly totalIncome: number;
};

/**
 * @description 収入管理画面の総収入を強調表示する。
 * @param props - 収入サマリーに表示する金額。
 * @returns 収入サマリーUI。
 * @example
 * <IncomeSummary totalIncome={315000} />
 */
export function IncomeSummary({ totalIncome }: IncomeSummaryProps): ReactElement {
  return <AmountHeroCard amount={totalIncome} label="今月の総収入" />;
}
