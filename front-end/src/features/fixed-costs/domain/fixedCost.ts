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

/**
 * 固定費フォームの入力値。
 */
export type FixedCostFormValues = {
  /** 入力中の固定費金額 */
  readonly amount: string;
  /** 入力中の固定費名 */
  readonly name: string;
  /** YYYY-MM形式の開始月 */
  readonly startMonth: string;
};
