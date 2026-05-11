import { createElement, type Handle } from "remix/ui";

import { darkColorValues } from "./dark-colors.ts";

const variableNames = {
  body: {
    primary: {
      foreground: "--app-body-primary-foreground",
      background: "--app-body-primary-background",
    },
    secondary: {
      foreground: "--app-body-secondary-foreground",
      background: "--app-body-secondary-background",
    },
    tertiary: {
      foreground: "--app-body-tertiary-foreground",
    },
  },
  border: {
    subtle: "--app-border-subtle",
    default: "--app-border-default",
    strong: "--app-border-strong",
  },
  focus: {
    ring: "--app-focus-ring",
  },
  overlay: {
    scrim: "--app-overlay-scrim",
  },
  solid: {
    orange: {
      background: "--app-solid-orange-background",
      foreground: "--app-solid-orange-foreground",
      backgroundHover: "--app-solid-orange-background-hover",
    },
    teal: {
      background: "--app-solid-teal-background",
      foreground: "--app-solid-teal-foreground",
      backgroundHover: "--app-solid-teal-background-hover",
    },
  },
  light: {
    teal: {
      background: "--app-light-teal-background",
      foreground: "--app-light-teal-foreground",
      backgroundHover: "--app-light-teal-background-hover",
    },
    orange: {
      background: "--app-light-orange-background",
      foreground: "--app-light-orange-foreground",
      borderPrimary: "--app-light-orange-border-primary",
      borderSecondary: "--app-light-orange-border-secondary",
      backgroundHover: "--app-light-orange-background-hover",
    },
    red: {
      background: "--app-light-red-background",
      foreground: "--app-light-red-foreground",
      backgroundHover: "--app-light-red-background-hover",
    },
  },
} as const;

interface VariableTree {
  [key: string]: string | VariableTree;
}

type MapLeaves<T, L> = T extends string
  ? L
  : { [K in keyof T]: MapLeaves<T[K], L> };

export type ColorValues = MapLeaves<typeof variableNames, string>;
export type ColorTokens = MapLeaves<typeof variableNames, string>;

export interface CreateColorThemeOptions {
  darkValues?: ColorValues;
  selector?: string;
}

export interface ColorThemeStyleProps {
  nonce?: string;
}

function collectVars(
  tree: VariableTree,
  values: unknown,
  path: string[] = [],
  out: Record<string, string> = {},
): Record<string, string> {
  for (let [key, node] of Object.entries(tree)) {
    let nextPath = [...path, key];
    let value = (values as Record<string, unknown> | undefined)?.[key];
    if (typeof node === "string") {
      if (typeof value !== "string" && typeof value !== "number") {
        throw new TypeError(
          `Expected color value at "${nextPath.join(".")}" to be a string or number`,
        );
      }
      out[node] = String(value);
    } else {
      if (typeof value !== "object" || value === null) {
        throw new TypeError(
          `Expected color group at "${nextPath.join(".")}" to be an object`,
        );
      }
      collectVars(node, value, nextPath, out);
    }
  }
  return out;
}

function mapLeavesToVar(tree: VariableTree): unknown {
  let out: Record<string, unknown> = {};
  for (let [key, node] of Object.entries(tree)) {
    out[key] = typeof node === "string" ? `var(${node})` : mapLeavesToVar(node);
  }
  return out;
}

function formatVars(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
}

function escapeStyleText(cssText: string): string {
  return cssText.replace(/<\/style/gi, "<\\/style");
}

export const colors = mapLeavesToVar(variableNames) as ColorTokens;

export function createColorTheme(
  values: ColorValues,
  options: CreateColorThemeOptions = {},
) {
  let selector = options.selector ?? ":root";
  let vars = Object.freeze(collectVars(variableNames, values));
  let darkValues = options.darkValues;
  let darkVars =
    darkValues == null
      ? undefined
      : Object.freeze(collectVars(variableNames, darkValues));
  let colorScheme = darkVars == null ? "light" : "light dark";
  let cssText = `${selector} {\n  color-scheme: ${colorScheme};\n${formatVars(vars)}\n}`;

  if (darkVars != null) {
    cssText += `\n\n@media (prefers-color-scheme: dark) {\n${selector} {\n${formatVars(darkVars)}\n}\n}`;
  }

  function Style(handle: Handle<ColorThemeStyleProps>) {
    return () =>
      createElement("style", {
        nonce: handle.props.nonce,
        "data-app-colors": "",
        "data-app-colors-selector": selector,
        innerHTML: escapeStyleText(cssText),
      });
  }

  return Object.assign(Style, {
    Style,
    cssText,
    selector,
    values,
    darkValues,
    darkVars,
    vars,
  });
}

export const lightColorValues = {
  body: {
    primary: {
      foreground: "oklch(0.2 0.0489 190)",
      background: "oklch(0.985 0.01 190)",
    },
    secondary: {
      foreground: "oklch(0.6 0.01 190)",
      background: "oklch(0.945 0.008 190)",
    },
    tertiary: {
      foreground: "oklch(0.85 0.01 190)",
    },
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
  solid: {
    orange: {
      background: "oklch(0.573242 0.153125 50)",
      foreground: "oklch(1 0 0)",
      backgroundHover: "oklch(0.523242 0.153125 50)",
    },
    teal: {
      background: "oklch(0.58 0.135 190)",
      foreground: "oklch(1 0 0)",
      backgroundHover: "oklch(0.53 0.135 190)",
    },
  },
  light: {
    teal: {
      background: "oklch(0.935 0.03 190)",
      foreground: "oklch(0.6 0.14 190)",
      backgroundHover: "oklch(0.92 0.04 190)",
    },
    orange: {
      background: "oklch(0.94 0.03 50)",
      foreground: "oklch(0.7 0.21 50)",
      borderPrimary: "oklch(0.7 0.2 50)",
      borderSecondary: "oklch(0.9 0.1 50)",
      backgroundHover: "oklch(0.92 0.03 50)",
    },
    red: {
      background: "oklch(0.945 0.04 25)",
      foreground: "oklch(0.67 0.275 25)",
      backgroundHover: "oklch(0.93 0.06 25)",
    },
  },
} satisfies ColorValues;

export const AppColors = createColorTheme(lightColorValues, {
  darkValues: darkColorValues,
});
