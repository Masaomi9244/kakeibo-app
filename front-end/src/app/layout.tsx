import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Kakeibo",
  description: "Personal kakeibo app",
};

type RootLayoutProps = {
  children: ReactNode;
};

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
