import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { AnnualSummaryPageContent } from "@/features/annual-summary/components/AnnualSummaryPageContent";

export default function AnnualSummaryPage(): ReactElement {
  return (
    <AppShell currentPath="/annual-summary">
      <AnnualSummaryPageContent />
    </AppShell>
  );
}
