import type { Expense } from "@/domains/expense";
import type { ExpenseDto, ListExpensesResponse } from "@/features/home/api/expenseDto";

/**
 * @description 出費DTOを出費domain modelへ変換する。
 * @param dto - APIから受け取った出費DTO。
 * @returns フロントエンドで扱う出費domain model。
 * @example
 * mapExpenseDto({ id: "id", amount: 780, spentAt: "2026-05-01T10:30:00+09:00" });
 */
export const mapExpenseDto = (dto: ExpenseDto): Expense => ({
  amount: dto.amount,
  id: dto.id,
  spentAt: dto.spentAt,
});

/**
 * @description 出費一覧responseを出費domain model配列へ変換する。
 * @param response - APIから受け取った出費一覧response。
 * @returns フロントエンドで扱う出費domain model配列。
 * @example
 * mapListExpensesResponse({ items: [] });
 */
export const mapListExpensesResponse = (response: ListExpensesResponse): Expense[] =>
  response.items.map(mapExpenseDto);
