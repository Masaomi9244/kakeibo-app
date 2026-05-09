import type {
  ExpenseCalendarDayDto,
  ExpenseCalendarDto,
  GetExpenseCalendarResponse,
} from "@/features/calendar/api/expenseCalendarDto";
import type {
  ExpenseCalendar,
  ExpenseCalendarDay,
} from "@/features/calendar/domain/calendar";

import { mapExpenseDto } from "@/features/home/mappers/expenseMapper";

/**
 * @description 日別カレンダーDTOをdomain modelへ変換する。
 * @param dto - APIから受け取った日別カレンダーDTO。
 * @returns 日別カレンダーdomain model。
 * @example
 * mapExpenseCalendarDayDto({ date: "2026-05-06", expenseTotal: 2140, remainingAmount: 205920 });
 */
export const mapExpenseCalendarDayDto = (
  dto: ExpenseCalendarDayDto,
): ExpenseCalendarDay => ({
  date: dto.date,
  expenseTotal: dto.expenseTotal,
  remainingAmount: dto.remainingAmount,
});

/**
 * @description 月間カレンダーDTOをdomain modelへ変換する。
 * @param dto - APIから受け取った月間カレンダーDTO。
 * @returns 月間カレンダーdomain model。
 * @example
 * mapExpenseCalendarDto({ month: "2026-05", availableIncome: 315000, fixedCostTotal: 95200, expenseTotal: 5960, remainingAmount: 213840, days: [], selectedDateExpenses: [] });
 */
export const mapExpenseCalendarDto = (dto: ExpenseCalendarDto): ExpenseCalendar => ({
  availableIncome: dto.availableIncome,
  days: dto.days.map(mapExpenseCalendarDayDto),
  expenseTotal: dto.expenseTotal,
  fixedCostTotal: dto.fixedCostTotal,
  month: dto.month,
  remainingAmount: dto.remainingAmount,
  selectedDateExpenses: dto.selectedDateExpenses.map(mapExpenseDto),
});

/**
 * @description カレンダー取得responseをdomain modelへ変換する。
 * @param response - APIから受け取ったカレンダー取得response。
 * @returns 月間カレンダーdomain model。
 * @example
 * mapGetExpenseCalendarResponse({ expenseCalendar: { month: "2026-05", availableIncome: 315000, fixedCostTotal: 95200, expenseTotal: 5960, remainingAmount: 213840, days: [], selectedDateExpenses: [] } });
 */
export const mapGetExpenseCalendarResponse = (
  response: GetExpenseCalendarResponse,
): ExpenseCalendar => mapExpenseCalendarDto(response.expenseCalendar);
