"use client";

import type { ReactElement, ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { appTheme } from "@/theme/appTheme";

/**
 * アプリProviderコンポーネントに渡すprops。
 */
type AppProvidersProps = {
  /** Provider配下に描画する画面 */
  children: ReactNode;
};

/**
 * @description アプリ全体で共有する外部ライブラリProviderを集約する。
 * @param props - Provider配下に描画するchildren。
 * @returns MUI themeとTanStack Queryを適用したchildren。
 * @example
 * <AppProviders><App /></AppProviders>
 */
export function AppProviders({ children }: Readonly<AppProvidersProps>): ReactElement {
  /** アプリ全体で共有するTanStack Query client */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
