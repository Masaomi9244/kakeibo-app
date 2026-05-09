/**
 * 固定費一覧に表示する固定費。
 */
export type FixedCostItem = {
  /** 毎月差し引く金額 */
  readonly amount: number;
  /** 固定費ID */
  readonly id: string;
  /** 予算計算に含める状態か */
  readonly isActive: boolean;
  /** 固定費名 */
  readonly name: string;
  /** 固定費の開始月 */
  readonly startMonth: string;
};
