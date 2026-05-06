import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { IncomePageContent } from "@/features/incomes/components/IncomePageContent";

export default function IncomesPage(): ReactElement {
  return (
    <AppShell currentPath="/incomes">
      <IncomePageContent />
    </AppShell>
  );
}
