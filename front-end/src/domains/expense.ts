/**
 * 出費domain model。
 */
export type Expense = {
  /** 出費金額 */
  readonly amount: number;
  /** 出費ID */
  readonly id: string;
  /** ISO8601形式の出費日時 */
  readonly spentAt: string;
};
