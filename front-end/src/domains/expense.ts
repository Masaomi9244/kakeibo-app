/**
 * フロントエンドで扱う出費domain model。
 */
export type Expense = {
  readonly amount: number;
  readonly id: string;
  readonly spentAt: string;
};
