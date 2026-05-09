import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { AnnualSummaryPageContent } from "@/components/templates/AnnualSummaryPageContent/AnnualSummaryPageContent";

/**
 * @description 年間サマリー画面のNext.jsルートとして共通レイアウトと画面本体を接続する。
 * @param なし
 * @returns 年間サマリー画面。
 * @example
 * <AnnualSummaryPage />
 */
export default function AnnualSummaryPage(): ReactElement {
  return (
    <AppShell currentPath="/annual-summary">
      <AnnualSummaryPageContent />
    </AppShell>
  );
}
