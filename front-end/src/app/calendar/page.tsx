import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { CalendarPageContent } from "@/components/templates/CalendarPageContent/CalendarPageContent";

/**
 * @description 月間カレンダー画面のNext.jsルートとして共通レイアウトと画面本体を接続する。
 * @param なし
 * @returns 月間カレンダー画面。
 * @example
 * <CalendarPage />
 */
export default function CalendarPage(): ReactElement {
  return (
    <AppShell currentPath="/calendar">
      <CalendarPageContent />
    </AppShell>
  );
}
