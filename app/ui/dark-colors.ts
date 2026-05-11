import type { ColorValues } from "./colors.ts";

export const darkColorValues = {
  body: {
    primary: {
      foreground: "oklch(0.85 0 0)",
      background: "oklch(0 0 0)",
    },
    secondary: {
      foreground: "oklch(0.5 0 0)",
      background: "oklch(0.025 0 0)",
    },
    tertiary: {
      foreground: "oklch(0.25 0 0)",
    },
  },
  border: {
    subtle: "oklch(0.1 0 0)",
    default: "oklch(0.25 0 0)",
    strong: "oklch(0.5 0 0)",
  },
  focus: {
    ring: "oklch(0.45 0.2 250)",
  },
  overlay: {
    scrim: "oklch(1 0 0 / 0.28)",
  },
  solid: {
    orange: {
      background: "oklch(0.625 0.198 50)",
      foreground: "oklch(0 0 0)",
      backgroundHover: "oklch(0.65 0.19 50)",
    },
  },
  light: {
    teal: {
      background: "oklch(0.04 0.03 190)",
      foreground: "oklch(0.47 0.1099 190)",
      backgroundHover: "oklch(0.07 0.04 190)",
    },
    orange: {
      background: "oklch(0.04 0.03 50)",
      foreground: "oklch(0.62 0.186 50)",
      borderPrimary: "oklch(0.3 0.2 50)",
      borderSecondary: "oklch(0.1 0.1 50)",
      backgroundHover: "oklch(0.07 0.04 50)",
    },
    red: {
      background: "oklch(0.04 0.04 25)",
      foreground: "oklch(0.33 0.275 25)",
      backgroundHover: "oklch(0.07 0.06 25)",
    },
  },
} satisfies ColorValues;
