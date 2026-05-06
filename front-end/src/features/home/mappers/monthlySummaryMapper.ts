import type { MonthlySummary } from "@/domains/monthlySummary";
import type { MonthlySummaryDto } from "@/features/home/api/monthlySummaryDto";

/**
 * @description 月次サマリーDTOを月次サマリーdomain modelへ変換する。
 * @param dto - APIから受け取った月次サマリーDTO。
 * @returns フロントエンドで扱う月次サマリーdomain model。
 * @example
 * mapMonthlySummaryDto({ month: "2026-05", totalIncome: 0, availableIncome: 0, reservedIncome: 0, fixedCostTotal: 0, expenseTotal: 0, remainingAmount: 0, actualBalance: 0 });
 */
export const mapMonthlySummaryDto = (dto: MonthlySummaryDto): MonthlySummary => ({
  actualBalance: dto.actualBalance,
  availableIncome: dto.availableIncome,
  expenseTotal: dto.expenseTotal,
  fixedCostTotal: dto.fixedCostTotal,
  month: dto.month,
  remainingAmount: dto.remainingAmount,
  reservedIncome: dto.reservedIncome,
  totalIncome: dto.totalIncome,
});
