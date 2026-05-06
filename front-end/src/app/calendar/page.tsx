import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { CalendarPageContent } from "@/features/calendar/components/CalendarPageContent";

export default function CalendarPage(): ReactElement {
  return (
    <AppShell currentPath="/calendar">
      <CalendarPageContent />
    </AppShell>
  );
}
