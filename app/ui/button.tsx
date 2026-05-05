import { Button as RemixButton, type ButtonProps as RemixButtonProps } from "remix/ui/button";
import { css } from "remix/ui";

import { theme } from "./theme.ts";

export type ButtonSize = "md" | "lg";

export type ButtonProps = RemixButtonProps & {
  size?: ButtonSize;
};

const baseStyle = css({
  "--rmx-button-label-padding-inline": "0",
  fontSize: theme.fontSize.md,
  fontFamily: theme.fontFamily.mono,
  fontWeight: theme.fontWeight.bold,
  textTransform: "uppercase",
  borderRadius: theme.radius.none,
  border: "none",
  boxShadow: "none",
  backgroundImage: "none",
  "&:hover": { backgroundImage: "none", boxShadow: "none" },
  "&:active": { backgroundImage: "none", boxShadow: "none" },
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

export function Button() {
  return ({ size = "md", tone = "primary", mix, ...props }: ButtonProps) => (
    <RemixButton {...props} tone={tone} mix={[baseStyle, sizeStyleBySize[size], mix]} />
  );
}
