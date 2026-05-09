/**
 * アプリ共通ナビゲーションに表示するリンク情報。
 */
export type NavigationItem = {
  /** 遷移先パス */
  readonly href: string;
  /** ナビゲーションに表示するラベル */
  readonly label: string;
  /** ナビゲーションに表示する短い記号 */
  readonly mark: string;
};

/** アプリ共通ナビゲーションに表示するリンク一覧。 */
export const appNavigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    label: "ホーム",
    mark: "H",
  },
  {
    href: "/incomes",
    label: "収入",
    mark: "I",
  },
  {
    href: "/fixed-costs",
    label: "固定費",
    mark: "F",
  },
  {
    href: "/calendar",
    label: "カレンダー",
    mark: "C",
  },
  {
    href: "/annual-summary",
    label: "年間",
    mark: "Y",
  },
];
