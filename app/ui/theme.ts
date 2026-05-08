import { createTheme, theme } from "remix/ui/theme";

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
    lvl0: "oklch(1 0 0)",
    lvl1: "oklch(0.96 0 0)",
    lvl2: "oklch(0.92 0 0)",
    lvl3: "oklch(0.88 0 0)",
    lvl4: "oklch(0.84 0 0)",
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
      primary: "oklch(0.2 0 0)",
      secondary: "oklch(0.6 0 0)",
      muted: "oklch(0.9 0 0)",
      link: "oklch(0.65625 0.175 50)",
    },
    border: {
      subtle: "oklch(0.9 0 0)",
      default: "oklch(0.75 0 0)",
      strong: "oklch(0.5 0 0)",
    },
    focus: {
      ring: "oklch(0.55 0.2 250)",
    },
    overlay: {
      scrim: "oklch(0 0 0 / 0.28)",
    },
    action: {
      primary: {
        background: "oklch(0.573242 0.153125 50)",
        backgroundHover: "oklch(0.523242 0.153125 50)",
        backgroundActive: "oklch(0.473242 0.153125 50)",
        foreground: "oklch(1 0 0)",
        border: "oklch(0.523242 0.153125 50)",
      },
      secondary: {
        background: "oklch(0.96 0.03 190)",
        backgroundHover: "oklch(0.93 0.04 190)",
        backgroundActive: "oklch(0.9 0.05 190)",
        foreground: "oklch(0.52 0.175 190)",
        border: "oklch(0.93 0.04 190)",
      },
      danger: {
        background: "oklch(0.96 0.04 25)",
        backgroundHover: "oklch(0.93 0.06 25)",
        backgroundActive: "oklch(0.9 0.08 25)",
        foreground: "oklch(0.668945 0.275 25)",
        border: "oklch(0.93 0.06 25)",
      },
    },
  },
});

export { theme };
