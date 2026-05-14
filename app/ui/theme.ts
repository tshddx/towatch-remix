import { createTheme, theme } from "remix/ui/theme";

import { colors } from "./colors.ts";

const COMMIT_MONO_STACK =
  '"CommitMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const AppTheme = createTheme(
  {
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
      lvl0: colors.bodyBg1,
      lvl1: colors.bodyBg2,
      lvl2: colors.border1,
      lvl3: colors.border2,
      lvl4: colors.border3,
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
        primary: colors.bodyText1,
        secondary: colors.bodyText2,
        muted: colors.bodyText2,
        link: colors.lightOrangeText,
      },
      border: {
        subtle: colors.border1,
        default: colors.border2,
        strong: colors.border3,
      },
      focus: {
        ring: colors.focusRing,
      },
      overlay: {
        scrim: colors.overlayScrim,
      },
      action: {
        primary: {
          background: colors.solidOrangeBg1,
          backgroundHover: colors.solidOrangeBg2,
          backgroundActive: colors.lightOrangeText,
          foreground: colors.solidOrangeText,
          border: colors.solidOrangeBg2,
        },
        secondary: {
          background: colors.lightTealBg1,
          backgroundHover: colors.lightTealBg2,
          backgroundActive: colors.lightTealText,
          foreground: colors.lightTealText,
          border: colors.lightTealBg2,
        },
        danger: {
          background: colors.lightRedBg1,
          backgroundHover: colors.lightRedBg2,
          backgroundActive: colors.lightRedText,
          foreground: colors.lightRedText,
          border: colors.lightRedBg2,
        },
      },
    },
  },
  {
    reset: false,
  },
);

export { theme };
