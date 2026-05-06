import type { ReactElement } from "react";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { formatYen } from "@/libs/money";

/**
 * 月間カレンダーの1日分セルに表示する値。
 */
type CalendarCell = {
  readonly dateKey: string;
  readonly day: number;
  readonly endingBalance?: number;
  readonly expenseTotal?: number;
  readonly isCurrentMonth: boolean;
  readonly isSelected: boolean;
};

/**
 * 月間カレンダーの日付セルコンポーネントに渡すprops。
 */
type CalendarDateCellProps = {
  readonly cell: CalendarCell;
};

/**
 * 選択日の支出一覧に表示する出費。
 */
type SelectedExpense = {
  readonly amount: number;
  readonly id: string;
  readonly time: string;
};

const weekDays: readonly string[] = ["日", "月", "火", "水", "木", "金", "土"];

const calendarCells: readonly CalendarCell[] = [
  { dateKey: "2026-04-26", day: 26, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-27", day: 27, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-28", day: 28, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-29", day: 29, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-30", day: 30, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-05-01", day: 1, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-02", day: 2, isCurrentMonth: true, isSelected: false },
  {
    dateKey: "2026-05-03",
    day: 3,
    expenseTotal: 620,
    isCurrentMonth: true,
    isSelected: false,
  },
  {
    dateKey: "2026-05-04",
    day: 4,
    expenseTotal: 3200,
    isCurrentMonth: true,
    isSelected: false,
  },
  { dateKey: "2026-05-05", day: 5, isCurrentMonth: true, isSelected: false },
  {
    dateKey: "2026-05-06",
    day: 6,
    endingBalance: 205920,
    expenseTotal: 2140,
    isCurrentMonth: true,
    isSelected: true,
  },
  { dateKey: "2026-05-07", day: 7, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-08", day: 8, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-09", day: 9, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-10", day: 10, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-11", day: 11, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-12", day: 12, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-13", day: 13, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-14", day: 14, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-15", day: 15, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-16", day: 16, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-17", day: 17, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-18", day: 18, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-19", day: 19, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-20", day: 20, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-21", day: 21, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-22", day: 22, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-23", day: 23, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-24", day: 24, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-25", day: 25, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-26", day: 26, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-27", day: 27, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-28", day: 28, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-29", day: 29, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-30", day: 30, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-31", day: 31, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-06-01", day: 1, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-02", day: 2, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-03", day: 3, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-04", day: 4, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-05", day: 5, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-06", day: 6, isCurrentMonth: false, isSelected: false },
];

const selectedExpenses: readonly SelectedExpense[] = [
  { amount: 160, id: "selected-1545", time: "15:45" },
  { amount: 1200, id: "selected-1230", time: "12:30" },
  { amount: 780, id: "selected-0915", time: "09:15" },
];

/**
 * @description カレンダーの日付セルを支出合計と残高付きで表示する。
 * @param props - 1日分のカレンダーセル情報。
 * @returns カレンダー日付セルUI。
 * @example
 * <CalendarDateCell cell={cell} />
 */
function CalendarDateCell({ cell }: CalendarDateCellProps): ReactElement {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: cell.isSelected ? "rgba(13, 148, 136, 0.08)" : "transparent",
        border: cell.isSelected ? 2 : 0,
        borderColor: "primary.main",
        borderRadius: 1,
        color: cell.isCurrentMonth ? "text.primary" : "text.disabled",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        justifyContent: "center",
        minHeight: { sm: 104, xs: 72 },
        p: 0.75,
      }}
    >
      <Typography sx={{ fontWeight: 700 }}>{cell.day}</Typography>
      {cell.expenseTotal !== undefined && (
        <Typography
          color="text.secondary"
          sx={{
            bgcolor: "rgba(100, 116, 139, 0.1)",
            borderRadius: 0.75,
            fontSize: { sm: 12, xs: 11 },
            px: 0.75,
          }}
        >
          {formatYen(cell.expenseTotal)}
        </Typography>
      )}
      {cell.endingBalance !== undefined && (
        <Typography
          color="success.main"
          sx={{ display: { sm: "block", xs: "none" }, fontSize: 12, fontWeight: 700 }}
        >
          残 {formatYen(cell.endingBalance)}
        </Typography>
      )}
    </Box>
  );
}

/**
 * @description 曜日ラベルに応じて日曜、土曜、平日の表示色を返す。
 * @param weekDay - 曜日ラベル。
 * @returns MUIのsx colorで利用できるtheme参照。
 * @example
 * getWeekDayColor("日");
 */
const getWeekDayColor = (weekDay: string): string => {
  if (weekDay === "日") {
    return "error.main";
  }

  if (weekDay === "土") {
    return "primary.main";
  }

  return "text.secondary";
};

/**
 * @description 対象月の日別支出合計と月次集計をカレンダー形式で表示する。
 * @param なし
 * @returns 月間カレンダーUI。
 * @example
 * <MonthCalendar />
 */
function MonthCalendar(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        p: { sm: 3, xs: 2 },
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
            2026年5月
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button size="small">前月</Button>
            <Button size="small" variant="outlined">
              今月
            </Button>
            <Button size="small">翌月</Button>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            textAlign: "center",
          }}
        >
          {weekDays.map((weekDay) => (
            <Typography
              color={getWeekDayColor(weekDay)}
              key={weekDay}
              sx={{ fontWeight: 700 }}
            >
              {weekDay}
            </Typography>
          ))}
          {calendarCells.map((cell) => (
            <CalendarDateCell cell={cell} key={cell.dateKey} />
          ))}
        </Box>
        <Box
          sx={{
            borderTop: 1,
            borderColor: "divider",
            display: "grid",
            gap: 2,
            gridTemplateColumns: { sm: "repeat(3, 1fr)", xs: "1fr 1fr" },
            pt: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography color="text.secondary">今月の支出</Typography>
            <Typography color="error.main" sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(5960)}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography color="text.secondary">1日の目安</Typography>
            <Typography sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(7090)}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography color="text.secondary">平均支出/日</Typography>
            <Typography sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(1192)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

/**
 * @description 選択日の支出合計と支出一覧を表示する。
 * @param なし
 * @returns 選択日の支出一覧UI。
 * @example
 * <SelectedDayExpenses />
 */
function SelectedDayExpenses(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { sm: 3, xs: 2.5 } }}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          2026年5月6日の支出
        </Typography>
      </Box>
      <Box sx={{ bgcolor: "rgba(220, 38, 38, 0.06)", p: { sm: 2.5, xs: 2 } }}>
        <Typography color="text.secondary" variant="body2">
          合計
        </Typography>
        <Typography color="error.main" sx={{ fontWeight: 700 }} variant="h6">
          {formatYen(2140)}
        </Typography>
      </Box>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
        {selectedExpenses.map((expense) => (
          <Box
            key={expense.id}
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              p: { sm: 2.5, xs: 2 },
            }}
          >
            <Typography color="text.secondary">{expense.time}</Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {formatYen(expense.amount)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

/**
 * @description 月間カレンダー画面の静的モック全体を表示する。
 * @param なし
 * @returns 月間カレンダー画面のコンテンツUI。
 * @example
 * <CalendarPageContent />
 */
export function CalendarPageContent(): ReactElement {
  return (
    <Stack spacing={3}>
      <PageHeader subtitle="日別の支出を確認する" title="月間カレンダー" />
      <MonthCalendar />
      <SelectedDayExpenses />
    </Stack>
  );
}
