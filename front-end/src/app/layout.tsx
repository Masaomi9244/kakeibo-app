import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import "./globals.css";
import { AppProviders } from "./providers";

/** Next.jsが利用するアプリ全体のメタデータ。 */
export const metadata: Metadata = {
  description: "Personal kakeibo app",
  title: "Kakeibo",
};

/**
 * ルートレイアウトコンポーネントに渡すprops。
 */
type RootLayoutProps = {
  /** 全ページ共通で描画する画面 */
  children: ReactNode;
};

/**
 * @description Next.js App Router全体にMUIとアプリProviderを適用する。
 * @param props - 全ページ共通で描画するchildren。
 * @returns HTMLルートを含むアプリ全体のレイアウト。
 * @example
 * <RootLayout><HomePage /></RootLayout>
 */
export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>): ReactElement {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <AppProviders>{children}</AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
