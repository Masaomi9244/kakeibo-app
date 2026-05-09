import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 月間カレンダーで利用するstyle定義。
 */
type MonthCalendarStyles = {
  /** カレンダー本体のグリッド */
  readonly calendarGrid: SxProps<Theme>;
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
    gap: 1,
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    textAlign: "center",
  },
  footerGrid: {
    borderColor: "divider",
    borderTop: 1,
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "repeat(3, 1fr)", xs: "1fr 1fr" },
    pt: 2,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  loadingText: {
    textAlign: "center",
  },
  monthTitle: {
    fontWeight: 700,
  },
  root: {
    borderRadius: 1,
    p: { sm: 3, xs: 2 },
  },
  switcher: {
    alignItems: "center",
  },
  value: {
    fontWeight: 700,
  },
  weekDay: {
    fontWeight: 700,
  },
} satisfies MonthCalendarStyles;

/**
 * @description 曜日ラベルに応じたMUI theme上の色参照を返す。
 * @param weekDay - 曜日ラベル。
 * @returns Typographyのcolorに渡すtheme参照。
 * @example
 * getWeekDayColor("日");
 */
export const getWeekDayColor = (weekDay: string): string => {
  if (weekDay === "日") {
    return "error.main";
  }

  if (weekDay === "土") {
    return "primary.main";
  }

  return "text.secondary";
};
