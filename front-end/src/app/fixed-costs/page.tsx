import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { FixedCostPageContent } from "@/features/fixed-costs/components/FixedCostPageContent";

export default function FixedCostsPage(): ReactElement {
  return (
    <AppShell currentPath="/fixed-costs">
      <FixedCostPageContent />
    </AppShell>
  );
}
