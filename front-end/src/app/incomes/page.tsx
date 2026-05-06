import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { IncomePageContent } from "@/features/incomes/components/IncomePageContent";

/**
 * @description 収入管理画面のNext.jsルートとして共通レイアウトと画面本体を接続する。
 * @param なし
 * @returns 収入管理画面。
 * @example
 * <IncomesPage />
 */
export default function IncomesPage(): ReactElement {
  return (
    <AppShell currentPath="/incomes">
      <IncomePageContent />
    </AppShell>
  );
}
