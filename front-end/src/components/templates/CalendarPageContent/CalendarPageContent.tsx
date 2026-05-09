import type { ReactElement } from "react";

import { Stack } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { MonthCalendar } from "@/components/organisms/MonthCalendar/MonthCalendar";
import { SelectedDayExpenses } from "@/components/organisms/SelectedDayExpenses/SelectedDayExpenses";
import { getCalendarMockData } from "@/features/calendar/usecases/getCalendarMockData";

/**
 * @description 月間カレンダー画面の静的モック全体を表示する。
 * @param なし
 * @returns 月間カレンダー画面のコンテンツUI。
 * @example
 * <CalendarPageContent />
 */
export function CalendarPageContent(): ReactElement {
  /** 月間カレンダー画面に表示するモックデータ */
  const calendarMockData = getCalendarMockData();
  /** 選択日の出費合計 */
  const selectedDayTotal = calendarMockData.selectedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  return (
    <Stack spacing={3}>
      <PageHeader subtitle="日別の支出を確認する" title="月間カレンダー" />
      <MonthCalendar
        calendarCells={calendarMockData.calendarCells}
        weekDays={calendarMockData.weekDays}
      />
      <SelectedDayExpenses
        expenses={calendarMockData.selectedExpenses}
        total={selectedDayTotal}
      />
    </Stack>
  );
}
