import {
  Button as RemixButton,
  type ButtonProps as RemixButtonProps,
} from "remix/ui/button";
import { css } from "remix/ui";

import { colors } from "./colors.ts";
import { theme } from "./theme.ts";

export type ButtonSize = "md" | "lg";

export type ButtonColor =
  | "solidOrange"
  | "solidTeal"
  | "lightTeal"
  | "lightOrange"
  | "lightRed";

export type ButtonProps = Omit<RemixButtonProps, "tone"> & {
  color?: ButtonColor;
  size?: ButtonSize;
};

const baseStyle = css({
  "--rmx-button-label-padding-inline": "0",
  fontSize: theme.fontSize.md,
  fontFamily: theme.fontFamily.mono,
  fontWeight: theme.fontWeight.bold,
  textTransform: "uppercase",
  borderRadius: theme.radius.none,
  border: "none !important",
  boxShadow: "none",
  backgroundImage: "none",
  "&:hover": {
    border: "none !important",
    backgroundImage: "none",
    boxShadow: "none",
  },
  "&:active": {
    border: "none !important",
    backgroundImage: "none",
    boxShadow: "none",
  },
});

const mdStyle = css({
  height: "1lh",
  minHeight: "1lh",
  paddingBlock: 0,
  paddingInline: 0,
});

const lgStyle = css({
  height: "auto",
  minHeight: 0,
  paddingBlock: "1lh",
  paddingInline: "1ch",
});

const sizeStyleBySize = {
  md: mdStyle,
  lg: lgStyle,
};

const solidOrangeStyle = css({
  background: colors.solidOrangeBg1,
  color: colors.solidOrangeText,
  "&:hover": {
    background: colors.solidOrangeBg2,
  },
  "&:active": {
    background: colors.lightOrangeText,
  },
});

const solidTealStyle = css({
  background: colors.solidTealBg1,
  color: colors.solidTealText,
  "&:hover": {
    background: colors.solidTealBg2,
  },
  "&:active": {
    background: colors.lightTealText,
  },
});

const lightTealStyle = css({
  background: colors.lightTealBg1,
  color: colors.lightTealText,
  "&:hover": {
    background: colors.lightTealBg2,
  },
  "&:active": {
    background: colors.lightTealText,
    color: colors.lightTealBg1,
  },
});

const lightOrangeStyle = css({
  background: colors.lightOrangeBg1,
  color: colors.lightOrangeText,
  "&:hover": {
    background: colors.lightOrangeBg2,
  },
  "&:active": {
    background: colors.lightOrangeText,
    color: colors.lightOrangeBg1,
  },
});

const lightRedStyle = css({
  background: colors.lightRedBg1,
  color: colors.lightRedText,
  "&:hover": {
    background: colors.lightRedBg2,
  },
  "&:active": {
    background: colors.lightRedText,
    color: colors.lightRedBg1,
  },
});

const colorStyleByColor = {
  solidOrange: solidOrangeStyle,
  solidTeal: solidTealStyle,
  lightTeal: lightTealStyle,
  lightOrange: lightOrangeStyle,
  lightRed: lightRedStyle,
};

export function Button() {
  return ({
    color = "solidOrange",
    size = "md",
    mix,
    ...props
  }: ButtonProps) => (
    <RemixButton
      {...props}
      tone="primary"
      mix={[baseStyle, sizeStyleBySize[size], colorStyleByColor[color], mix]}
    />
  );
}
