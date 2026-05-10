import type { ReactElement, SVGProps } from "react";

/**
 * アプリ内で利用する独自アイコン名。
 */
export type AppIconName =
  | "annualSummary"
  | "brand"
  | "calendar"
  | "fixedCost"
  | "home"
  | "income"
  | "logout";

/**
 * アプリ独自アイコンに渡すprops。
 */
type AppIconProps = {
  /** アイコンのアクセシビリティ名 */
  readonly title?: string;
  /** 表示するアイコン名 */
  readonly name: AppIconName;
  /** アイコンの表示サイズ */
  readonly size?: number;
};

/** SVG pathに共通で渡す描画属性。 */
const commonPathProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
} satisfies SVGProps<SVGPathElement>;

/**
 * @description 指定されたアイコン名に対応するSVG pathを返す。
 * @param name - 表示するアイコン名。
 * @returns アイコンを構成するSVG path。
 * @example
 * getIconPaths("home");
 */
function getIconPaths(name: AppIconName): readonly string[] {
  switch (name) {
    case "annualSummary":
      return [
        "M5.5 18.5V12",
        "M10 18.5V8.5",
        "M14.5 18.5V10.5",
        "M19 18.5V5.5",
        "M4 20.5h17",
      ];
    case "brand":
      return [
        "M5.5 7.5h12.25A2.25 2.25 0 0 1 20 9.75v7.5a2.25 2.25 0 0 1-2.25 2.25H6.25A2.25 2.25 0 0 1 4 17.25V6.75A2.25 2.25 0 0 1 6.25 4.5h9.5",
        "M15.5 12h4.5v4h-4.5a2 2 0 0 1 0-4Z",
        "M7.25 8.25h6.5",
      ];
    case "calendar":
      return [
        "M6.5 4.5v3",
        "M17.5 4.5v3",
        "M4.5 9h15",
        "M6.75 6h10.5A2.25 2.25 0 0 1 19.5 8.25v9A2.25 2.25 0 0 1 17.25 19.5H6.75A2.25 2.25 0 0 1 4.5 17.25v-9A2.25 2.25 0 0 1 6.75 6Z",
        "M8 12.5h2.5",
        "M8 16h5",
      ];
    case "fixedCost":
      return [
        "M5 8.5h14",
        "M6.75 5.5h10.5A2.25 2.25 0 0 1 19.5 7.75v8.5A2.25 2.25 0 0 1 17.25 18.5H6.75A2.25 2.25 0 0 1 4.5 16.25v-8.5A2.25 2.25 0 0 1 6.75 5.5Z",
        "M8 13.5h4",
        "M15.75 13.25a1.75 1.75 0 1 0 0 .01",
      ];
    case "home":
      return ["M4.5 11.5 12 5l7.5 6.5", "M6.5 10.5v8h4v-4.75h3v4.75h4v-8", "M9 18.5h6"];
    case "income":
      return ["M4.5 16.5h15", "m5.25 13.25 3.5-3.5 3.25 2.25 5-6", "M16.5 7.5h4v4"];
    case "logout":
      return [
        "M13.5 6.5H7.75A2.25 2.25 0 0 0 5.5 8.75v6.5a2.25 2.25 0 0 0 2.25 2.25h5.75",
        "M13.5 12h7",
        "m17.75 8.75 3.25 3.25-3.25 3.25",
      ];
  }
}

/**
 * @description 家計簿アプリ専用に生成した線画アイコンを表示する。
 * @param props - アイコン名、表示サイズ、アクセシビリティ名。
 * @returns アプリ独自SVGアイコン。
 * @example
 * <AppIcon name="home" title="ホーム" />
 */
export function AppIcon({ name, size = 22, title }: AppIconProps): ReactElement {
  /** SVG内で重複しないtitle要素のID。 */
  const titleId = title === undefined ? undefined : `app-icon-${name}`;

  return (
    <svg
      aria-hidden={title === undefined ? "true" : undefined}
      aria-labelledby={titleId}
      height={size}
      role={title === undefined ? undefined : "img"}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title === undefined ? null : <title id={titleId}>{title}</title>}
      {getIconPaths(name).map((path) => (
        <path d={path} key={path} {...commonPathProps} />
      ))}
    </svg>
  );
}
