import type { MonthlySummaryDto } from "@/features/home/api/monthlySummaryDto";

/**
 * 出費APIが返す出費DTO。
 */
export type ExpenseDto = {
  /** 出費金額 */
  readonly amount: number;
  /** 出費ID */
  readonly id: string;
  /** ISO8601形式の出費日時 */
  readonly spentAt: string;
};

/**
 * 出費登録API request DTO。
 */
export type CreateExpenseRequest = {
  /** 出費金額 */
  readonly amount: number;
};

/**
 * 出費登録API response DTO。
 */
export type CreateExpenseResponse = {
  /** 登録した出費 */
  readonly expense: ExpenseDto;
  /** 登録後の月次サマリー */
  readonly monthlySummary: MonthlySummaryDto;
};

/**
 * 出費一覧API response DTO。
 */
export type ListExpensesResponse = {
  /** 出費一覧 */
  readonly items: ExpenseDto[];
};

/**
 * 出費削除API response DTO。
 */
export type DeleteExpenseResponse = {
  /** 削除完了メッセージ */
  readonly message: string;
};
