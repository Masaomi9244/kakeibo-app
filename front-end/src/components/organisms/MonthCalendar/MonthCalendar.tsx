import type { ReactElement } from "react";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import type { CalendarCell } from "@/features/calendar/domain/calendar";

import { CalendarDateCell } from "@/components/molecules/CalendarDateCell";
import {
  getWeekDayColor,
  monthCalendarStyles,
} from "@/components/organisms/MonthCalendar/MonthCalendar.styles";
import { formatYen } from "@/libs/money";

/**
 * 月間カレンダーcomponentに渡すprops。
 */
type MonthCalendarProps = {
  /** カレンダーセル一覧 */
  readonly calendarCells: readonly CalendarCell[];
  /** 曜日ラベル一覧 */
  readonly weekDays: readonly string[];
};

/**
 * @description 対象月の日別支出合計と月次集計をカレンダー形式で表示する。
 * @param props - 曜日ラベルと日別カレンダーセル。
 * @returns 月間カレンダーUI。
 * @example
 * <MonthCalendar weekDays={weekDays} calendarCells={calendarCells} />
 */
export function MonthCalendar({
  calendarCells,
  weekDays,
}: MonthCalendarProps): ReactElement {
  return (
    <Paper variant="outlined" sx={monthCalendarStyles.root}>
      <Stack spacing={3}>
        <Stack direction="row" sx={monthCalendarStyles.header}>
          <Typography component="h2" sx={monthCalendarStyles.monthTitle} variant="h6">
            2026年5月
          </Typography>
          <Stack direction="row" spacing={1} sx={monthCalendarStyles.switcher}>
            <Button size="small">前月</Button>
            <Button size="small" variant="outlined">
              今月
            </Button>
            <Button size="small">翌月</Button>
          </Stack>
        </Stack>
        <Box sx={monthCalendarStyles.calendarGrid}>
          {weekDays.map((weekDay) => (
            <Typography
              color={getWeekDayColor(weekDay)}
              key={weekDay}
              sx={monthCalendarStyles.weekDay}
            >
              {weekDay}
            </Typography>
          ))}
          {calendarCells.map((cell) => (
            <CalendarDateCell cell={cell} key={cell.dateKey} />
          ))}
        </Box>
        <Box sx={monthCalendarStyles.footerGrid}>
          <Stack spacing={0.5}>
            <Typography color="text.secondary">今月の支出</Typography>
            <Typography color="error.main" sx={monthCalendarStyles.value} variant="h6">
              {formatYen(5960)}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography color="text.secondary">1日の目安</Typography>
            <Typography sx={monthCalendarStyles.value} variant="h6">
              {formatYen(7090)}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography color="text.secondary">平均支出/日</Typography>
            <Typography sx={monthCalendarStyles.value} variant="h6">
              {formatYen(1192)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
