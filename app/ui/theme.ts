import { createTheme, theme } from "remix/ui/theme";

import { colors } from "./colors.ts";

const COMMIT_MONO_STACK =
  '"CommitMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const AppTheme = createTheme({
  space: {
    none: "0px",
    px: "1px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  radius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  fontFamily: {
    sans: COMMIT_MONO_STACK,
    mono: COMMIT_MONO_STACK,
  },
  fontSize: {
    xxxs: "0px",
    xxs: "0px",
    xs: "0px",
    sm: "0px",
    md: "0.8125rem", // 13px
    lg: "1.625rem", // 26px
    xl: "0px",
    xxl: "0px",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1rem", // for use with fontSize.md
    relaxed: "2rem", // for use with fontSize.lg
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    meta: "0.06em",
    wide: "0.1em",
  },
  fontWeight: {
    normal: "400",
    medium: "700",
    semibold: "700",
    bold: "800",
  },
  control: {
    height: {
      sm: "28px",
      md: "32px",
      lg: "36px",
    },
  },
  surface: {
    lvl0: colors.body.primary.background,
    lvl1: colors.body.secondary.background,
    lvl2: colors.border.subtle,
    lvl3: colors.border.default,
    lvl4: colors.border.strong,
  },
  shadow: {
    xs: "0 1px 1px oklch(0 0 0 / 0.05)",
    sm: "0 1px 2px oklch(0 0 0 / 0.07)",
    md: "0 6px 18px oklch(0 0 0 / 0.08)",
    lg: "0 16px 34px oklch(0 0 0 / 0.10)",
    xl: "0 24px 52px oklch(0 0 0 / 0.14)",
  },
  colors: {
    text: {
      primary: colors.body.primary.foreground,
      secondary: colors.body.secondary.foreground,
      muted: colors.body.secondary.foreground,
      link: colors.light.orange.foreground,
    },
    border: {
      subtle: colors.border.subtle,
      default: colors.border.default,
      strong: colors.border.strong,
    },
    focus: {
      ring: colors.focus.ring,
    },
    overlay: {
      scrim: colors.overlay.scrim,
    },
    action: {
      primary: {
        background: colors.solid.orange.background,
        backgroundHover: colors.solid.orange.backgroundHover,
        backgroundActive: colors.light.orange.foreground,
        foreground: colors.solid.orange.foreground,
        border: colors.solid.orange.backgroundHover,
      },
      secondary: {
        background: colors.light.teal.background,
        backgroundHover: colors.light.teal.backgroundHover,
        backgroundActive: colors.light.teal.foreground,
        foreground: colors.light.teal.foreground,
        border: colors.light.teal.backgroundHover,
      },
      danger: {
        background: colors.light.red.background,
        backgroundHover: colors.light.red.backgroundHover,
        backgroundActive: colors.light.red.foreground,
        foreground: colors.light.red.foreground,
        border: colors.light.red.backgroundHover,
      },
    },
  },
});

export { theme };
