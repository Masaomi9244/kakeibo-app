import type { AppIconName } from "@/components/atoms/AppIcon/AppIcon";

/**
 * アプリ共通ナビゲーションに表示するリンク情報。
 */
export type NavigationItem = {
  /** 遷移先パス */
  readonly href: string;
  /** ナビゲーションに表示するアイコン名 */
  readonly iconName: AppIconName;
  /** ナビゲーションに表示するラベル */
  readonly label: string;
};

/** アプリ共通ナビゲーションに表示するリンク一覧。 */
export const appNavigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    iconName: "home",
    label: "ホーム",
  },
  {
    href: "/incomes",
    iconName: "income",
    label: "収入",
  },
  {
    href: "/fixed-costs",
    iconName: "fixedCost",
    label: "固定費",
  },
  {
    href: "/calendar",
    iconName: "calendar",
    label: "カレンダー",
  },
  {
    href: "/annual-summary",
    iconName: "annualSummary",
    label: "年間",
  },
];
