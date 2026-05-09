import type { Income } from "@/domains/income";
import type { IncomeDto, ListIncomesResponse } from "@/features/incomes/api/incomeDto";

/**
 * @description 収入DTOを収入domain modelへ変換する。
 * @param dto - APIから受け取った収入DTO。
 * @returns フロントエンドで扱う収入domain model。
 * @example
 * mapIncomeDto({ id: "id", amount: 250000, incomeDate: "2026-05-25", memo: "給与", includedInBalance: true });
 */
export const mapIncomeDto = (dto: IncomeDto): Income => ({
  amount: dto.amount,
  id: dto.id,
  includedInBalance: dto.includedInBalance,
  incomeDate: dto.incomeDate,
  memo: dto.memo === "" ? null : dto.memo,
});

/**
 * @description 収入一覧responseを収入domain model配列へ変換する。
 * @param response - APIから受け取った収入一覧response。
 * @returns フロントエンドで扱う収入domain model配列。
 * @example
 * mapListIncomesResponse({ items: [] });
 */
export const mapListIncomesResponse = (response: ListIncomesResponse): Income[] =>
  response.items.map(mapIncomeDto);
