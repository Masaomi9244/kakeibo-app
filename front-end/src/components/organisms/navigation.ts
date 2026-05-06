export type NavigationItem = {
  readonly href: string;
  readonly label: string;
  readonly mark: string;
};

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
