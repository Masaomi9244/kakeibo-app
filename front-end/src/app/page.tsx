import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { HomePageContent } from "@/features/home/components/HomePageContent";

export default function HomePage(): ReactElement {
  return (
    <AppShell currentPath="/">
      <HomePageContent />
    </AppShell>
  );
}
