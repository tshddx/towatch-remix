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
  background: colors.solid.orange.background,
  color: colors.solid.orange.foreground,
  "&:hover": {
    background: colors.solid.orange.backgroundHover,
  },
  "&:active": {
    background: colors.light.orange.foreground,
  },
});

const solidTealStyle = css({
  background: colors.solid.teal.background,
  color: colors.solid.teal.foreground,
  "&:hover": {
    background: colors.solid.teal.backgroundHover,
  },
  "&:active": {
    background: colors.light.teal.foreground,
  },
});

const lightTealStyle = css({
  background: colors.light.teal.background,
  color: colors.light.teal.foreground,
  "&:hover": {
    background: colors.light.teal.backgroundHover,
  },
  "&:active": {
    background: colors.light.teal.foreground,
    color: colors.light.teal.background,
  },
});

const lightOrangeStyle = css({
  background: colors.light.orange.background,
  color: colors.light.orange.foreground,
  "&:hover": {
    background: colors.light.orange.backgroundHover,
  },
  "&:active": {
    background: colors.light.orange.foreground,
    color: colors.light.orange.background,
  },
});

const lightRedStyle = css({
  background: colors.light.red.background,
  color: colors.light.red.foreground,
  "&:hover": {
    background: colors.light.red.backgroundHover,
  },
  "&:active": {
    background: colors.light.red.foreground,
    color: colors.light.red.background,
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
