"use client";

import type { ReactElement } from "react";

import { Alert, Stack } from "@mui/material";

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
      {calendarPage.calendarErrorMessage !== undefined ? (
        <Alert severity="error">{calendarPage.calendarErrorMessage}</Alert>
      ) : null}
      <MonthCalendar
        calendarCells={calendarPage.calendarCells}
        isLoading={calendarPage.calendarIsLoading}
        monthLabel={calendarPage.monthLabel}
        onGoToCurrentMonth={calendarPage.handleGoToCurrentMonth}
        onGoToNextMonth={calendarPage.handleGoToNextMonth}
        onGoToPreviousMonth={calendarPage.handleGoToPreviousMonth}
        onSelectDate={calendarPage.handleSelectDate}
        stats={calendarPage.stats}
        weekDays={calendarPage.weekDays}
      />
      <SelectedDayExpenses
        expenses={calendarPage.selectedExpenses}
        isLoading={calendarPage.calendarIsLoading}
        selectedDateLabel={calendarPage.selectedDateLabel}
        total={calendarPage.selectedDayTotal}
      />
    </Stack>
  );
}
