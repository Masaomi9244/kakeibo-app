import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 月間カレンダーで利用するstyle定義。
 */
type MonthCalendarStyles = {
  /** カレンダー本体のグリッド */
  readonly calendarGrid: SxProps<Theme>;
  /** カレンダー内の縦配置 */
  readonly contentStack: SxProps<Theme>;
  /** 月次集計エリア */
  readonly footerGrid: SxProps<Theme>;
  /** カード上部 */
  readonly header: SxProps<Theme>;
  /** 読み込み中メッセージ */
  readonly loadingText: SxProps<Theme>;
  /** 月表示 */
  readonly monthTitle: SxProps<Theme>;
  /** カレンダーカード全体 */
  readonly root: SxProps<Theme>;
  /** 月移動ボタン */
  readonly switchButton: SxProps<Theme>;
  /** ナビゲーションボタン行 */
  readonly switcher: SxProps<Theme>;
  /** 集計値 */
  readonly value: SxProps<Theme>;
  /** 曜日ラベル */
  readonly weekDay: SxProps<Theme>;
};

/** 月間カレンダーで利用するstyle群。 */
export const monthCalendarStyles = {
  calendarGrid: {
    display: "grid",
    gap: { md: 0.5, xs: 1 },
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    textAlign: "center",
  },
  contentStack: {
    gap: { md: 2, xs: 3 },
  },
  footerGrid: {
    borderColor: "divider",
    borderTop: 1,
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "repeat(2, 1fr)", xs: "1fr 1fr" },
    pt: { md: 1.5, xs: 2 },
  },
  header: {
    alignItems: "center",
    columnGap: 1,
    justifyContent: "space-between",
    minWidth: 0,
  },
  loadingText: {
    textAlign: "center",
  },
  monthTitle: {
    flexShrink: 0,
    fontWeight: 700,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  },
  root: {
    borderRadius: 1,
    p: { md: 2, sm: 3, xs: 2 },
  },
  switchButton: {
    minWidth: { sm: 64, xs: 44 },
    px: { sm: 1.5, xs: 0.5 },
  },
  switcher: {
    alignItems: "center",
    flexShrink: 0,
  },
  value: {
    fontWeight: 700,
  },
  weekDay: {
    color: "text.primary",
    fontWeight: 700,
  },
} satisfies MonthCalendarStyles;

/**
 * @description 曜日ラベルに応じた見出し用styleを返す。
 * @param weekDay - 曜日ラベル。
 * @returns 曜日ラベルのTypographyへ渡すsx。
 * @example
 * getWeekDaySx("日");
 */
export const getWeekDaySx = (weekDay: string): SxProps<Theme> => {
  if (weekDay === "日") {
    return [monthCalendarStyles.weekDay, { color: "#dc2626" }];
  }

  if (weekDay === "土") {
    return [monthCalendarStyles.weekDay, { color: "#0284c7" }];
  }

  return monthCalendarStyles.weekDay;
};
