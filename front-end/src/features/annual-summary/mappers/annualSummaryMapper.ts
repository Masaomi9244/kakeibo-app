import type {
  AnnualSummaryDto,
  AnnualSummaryMonthDto,
  GetAnnualSummaryResponse,
} from "@/features/annual-summary/api/annualSummaryDto";
import type {
  AnnualSummary,
  AnnualSummaryMonth,
} from "@/features/annual-summary/domain/annualSummary";

/**
 * @description 月別年間サマリーDTOをdomain modelへ変換する。
 * @param dto - APIから受け取った月別年間サマリーDTO。
 * @returns 月別年間サマリーdomain model。
 * @example
 * mapAnnualSummaryMonthDto({ month: "2026-05", totalIncome: 315000, availableIncome: 315000, reservedIncome: 0, fixedCostTotal: 95200, expenseTotal: 5960, actualBalance: 213840, availableBalance: 213840 });
 */
export const mapAnnualSummaryMonthDto = (
  dto: AnnualSummaryMonthDto,
): AnnualSummaryMonth => ({
  actualBalance: dto.actualBalance,
  availableBalance: dto.availableBalance,
  availableIncome: dto.availableIncome,
  expenseTotal: dto.expenseTotal,
  fixedCostTotal: dto.fixedCostTotal,
  month: dto.month,
  reservedIncome: dto.reservedIncome,
  totalIncome: dto.totalIncome,
});

/**
 * @description 年間サマリーDTOをdomain modelへ変換する。
 * @param dto - APIから受け取った年間サマリーDTO。
 * @returns 年間サマリーdomain model。
 * @example
 * mapAnnualSummaryDto({ year: 2026, totalIncome: 315000, availableIncome: 315000, reservedIncome: 0, fixedCostTotal: 761600, expenseTotal: 5960, actualBalance: -452560, availableBalance: -452560, months: [] });
 */
export const mapAnnualSummaryDto = (dto: AnnualSummaryDto): AnnualSummary => ({
  actualBalance: dto.actualBalance,
  availableBalance: dto.availableBalance,
  availableIncome: dto.availableIncome,
  expenseTotal: dto.expenseTotal,
  fixedCostTotal: dto.fixedCostTotal,
  months: dto.months.map(mapAnnualSummaryMonthDto),
  reservedIncome: dto.reservedIncome,
  totalIncome: dto.totalIncome,
  year: dto.year,
});

/**
 * @description 年間サマリー取得responseをdomain modelへ変換する。
 * @param response - APIから受け取った年間サマリー取得response。
 * @returns 年間サマリーdomain model。
 * @example
 * mapGetAnnualSummaryResponse({ annualSummary: { year: 2026, totalIncome: 315000, availableIncome: 315000, reservedIncome: 0, fixedCostTotal: 761600, expenseTotal: 5960, actualBalance: -452560, availableBalance: -452560, months: [] } });
 */
export const mapGetAnnualSummaryResponse = (
  response: GetAnnualSummaryResponse,
): AnnualSummary => mapAnnualSummaryDto(response.annualSummary);
