import type { ReactElement } from "react";

import { AppShell } from "@/components/organisms/AppShell";
import { HomePageContent } from "@/components/templates/HomePageContent/HomePageContent";

/**
 * @description ホーム画面のNext.jsルートとして共通レイアウトと画面本体を接続する。
 * @param なし
 * @returns ホーム画面。
 * @example
 * <HomePage />
 */
export default function HomePage(): ReactElement {
  return (
    <AppShell currentPath="/">
      <HomePageContent />
    </AppShell>
  );
}
