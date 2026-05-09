import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { FixedCostPageContent } from "@/components/templates/FixedCostPageContent/FixedCostPageContent";

/**
 * @description 固定費管理画面のNext.jsルートとして共通レイアウトと画面本体を接続する。
 * @param なし
 * @returns 固定費管理画面。
 * @example
 * <FixedCostsPage />
 */
export default function FixedCostsPage(): ReactElement {
  return (
    <AppShell currentPath="/fixed-costs">
      <FixedCostPageContent />
    </AppShell>
  );
}
