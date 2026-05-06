import { createTheme } from "@mui/material/styles";

// MVP全体の色、余白、角丸、Typographyの基準を管理する。
export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d9488",
    },
    secondary: {
      main: "#059669",
    },
    error: {
      main: "#dc2626",
    },
    success: {
      main: "#059669",
    },
    warning: {
      main: "#f59e0b",
    },
    background: {
      default: "#f5f7f9",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});
