"use client";

import type { ReactElement } from "react";

import { Stack } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { MonthCalendar } from "@/components/organisms/MonthCalendar/MonthCalendar";
import { SelectedDayExpenses } from "@/components/organisms/SelectedDayExpenses/SelectedDayExpenses";
import { useCalendarPageViewModel } from "@/features/calendar/hooks/useCalendarPageViewModel";

/**
 * @description 月間カレンダー画面のview model接続済みコンテンツ全体を表示する。
 * @param なし
 * @returns 月間カレンダー画面のコンテンツUI。
 * @example
 * <CalendarPageContent />
 */
export function CalendarPageContent(): ReactElement {
  /** 月間カレンダー画面の表示状態と操作 */
  const calendarPage = useCalendarPageViewModel();

  return (
    <Stack spacing={3}>
      <PageHeader subtitle="日別の支出を確認する" title="月間カレンダー" />
      <MonthCalendar
        calendarCells={calendarPage.calendarCells}
        monthLabel={calendarPage.monthLabel}
        onSelectDate={calendarPage.handleSelectDate}
        stats={calendarPage.stats}
        weekDays={calendarPage.weekDays}
      />
      <SelectedDayExpenses
        expenses={calendarPage.selectedExpenses}
        selectedDateLabel={calendarPage.selectedDateLabel}
        total={calendarPage.selectedDayTotal}
      />
    </Stack>
  );
}
