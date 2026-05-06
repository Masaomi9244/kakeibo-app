import type { MonthlySummaryDto } from "@/features/home/api/monthlySummaryDto";

/**
 * 出費APIが返す出費DTO。
 */
export type ExpenseDto = {
  readonly amount: number;
  readonly id: string;
  readonly spentAt: string;
};

/**
 * 出費登録API request DTO。
 */
export type CreateExpenseRequest = {
  readonly amount: number;
};

/**
 * 出費登録API response DTO。
 */
export type CreateExpenseResponse = {
  readonly expense: ExpenseDto;
  readonly monthlySummary: MonthlySummaryDto;
};

/**
 * 出費一覧API response DTO。
 */
export type ListExpensesResponse = {
  readonly items: ExpenseDto[];
};
