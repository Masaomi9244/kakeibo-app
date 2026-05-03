"use client";

import type { ReactElement, ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { appTheme } from "@/theme/appTheme";

type AppProvidersProps = {
  children: ReactNode;
};

// アプリ全体で共有する外部ライブラリProviderを集約する。
export function AppProviders({ children }: Readonly<AppProvidersProps>): ReactElement {
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
