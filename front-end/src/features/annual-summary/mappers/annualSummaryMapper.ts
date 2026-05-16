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
 * 月別年間サマリーが存在しない月に使う0埋め値。
 */
type EmptyAnnualSummaryMonthInput = {
  /** 対象月のYYYY-MM形式 */
  readonly month: string;
};

/**
 * @description 年間サマリーで月別集計がない月の0埋め値を作る。
 * @param input - 0埋めする対象月。
 * @returns 金額0の月別集計DTO。
 * @example
 * createEmptyAnnualSummaryMonth({ month: "2026-01" });
 */
const createEmptyAnnualSummaryMonth = (
  input: EmptyAnnualSummaryMonthInput,
): AnnualSummaryMonthDto => ({
  actualBalance: 0,
  availableBalance: 0,
  availableIncome: 0,
  expenseTotal: 0,
  fixedCostTotal: 0,
  month: input.month,
  reservedIncome: 0,
  totalIncome: 0,
});

/**
 * @description 年間サマリー画面用に月別集計を1月から12月まで0埋めする。
 * @param input - 0埋め対象の年と既存月別集計。
 * @returns 1月から12月まで揃えた月別集計一覧。
 * @example
 * fillAnnualSummaryMonths({ year: 2026, months: [] });
 */
const fillAnnualSummaryMonths = (input: {
  /** 対象年 */
  readonly year: number;
  /** APIから取得した月別集計一覧 */
  readonly months: readonly AnnualSummaryMonthDto[];
}): AnnualSummaryMonthDto[] => {
  /** 月別集計をYYYY-MMで引くためのmap */
  const monthMap = new Map(input.months.map((month) => [month.month, month]));

  return Array.from({ length: 12 }, (_, index) => {
    /** 1月始まりの月番号 */
    const monthNumber = index + 1;
    /** 0埋め後の対象月 */
    const monthKey = `${input.year}-${String(monthNumber).padStart(2, "0")}`;

    return (
      monthMap.get(monthKey) ??
      createEmptyAnnualSummaryMonth({
        month: monthKey,
      })
    );
  });
};

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
  months: fillAnnualSummaryMonths({ months: dto.months, year: dto.year }).map(
    mapAnnualSummaryMonthDto,
  ),
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
