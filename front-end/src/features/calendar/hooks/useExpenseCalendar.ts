import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import type { ExpenseCalendar } from "@/features/calendar/domain/calendar";

import { getExpenseCalendar } from "@/features/calendar/api/expenseCalendarApi";
import { mapGetExpenseCalendarResponse } from "@/features/calendar/mappers/expenseCalendarMapper";
import { expenseCalendarKeys } from "@/libs/queryKeys";

/**
 * @description 対象月のカレンダー集計と選択日の出費明細を取得する。
 * @param month - YYYY-MM形式の対象月。
 * @param selectedDate - YYYY-MM-DD形式の選択日。
 * @returns 月間カレンダーquery result。
 * @example
 * useExpenseCalendar("2026-05", "2026-05-06");
 */
export function useExpenseCalendar(
  month: string,
  selectedDate: string,
): UseQueryResult<ExpenseCalendar> {
  return useQuery({
    placeholderData: (previousData) =>
      previousData?.month === month ? previousData : undefined,
    queryFn: async () => {
      /** カレンダー取得APIのresponse */
      const response = await getExpenseCalendar({ month, selectedDate });

      return mapGetExpenseCalendarResponse(response);
    },
    queryKey: expenseCalendarKeys.byMonthAndDate(month, selectedDate),
  });
}
