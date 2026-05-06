import type { ReactElement } from "react";

import { Typography } from "@mui/material";

import { formatYen } from "@/libs/money";

type AmountTone = "default" | "expense" | "fixedCost" | "income" | "inverse";

type AmountTextProps = {
  readonly amount: number;
  readonly size?: "large" | "medium" | "small";
  readonly tone?: AmountTone;
};

const getAmountColor = (tone: AmountTone): string => {
  switch (tone) {
    case "expense":
      return "error.main";
    case "fixedCost":
      return "warning.main";
    case "income":
      return "success.main";
    case "inverse":
      return "common.white";
    case "default":
      return "text.primary";
  }
};

const getAmountVariant = (
  size: NonNullable<AmountTextProps["size"]>,
): "h3" | "h4" | "h5" => {
  switch (size) {
    case "large":
      return "h3";
    case "medium":
      return "h4";
    case "small":
      return "h5";
  }
};

export function AmountText({
  amount,
  size = "medium",
  tone = "default",
}: AmountTextProps): ReactElement {
  return (
    <Typography
      component="p"
      variant={getAmountVariant(size)}
      sx={{
        color: getAmountColor(tone),
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 1.15,
      }}
    >
      {formatYen(amount)}
    </Typography>
  );
}
