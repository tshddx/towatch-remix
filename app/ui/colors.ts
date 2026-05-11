import { createElement, type Handle } from "remix/ui";

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
  },
  solid: {
    orange: {
      background: "--app-solid-orange-background",
      foreground: "--app-solid-orange-foreground",
      backgroundHover: "--app-solid-orange-background-hover",
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
  let lines = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  let cssText = `${selector} {\n${lines}\n}`;

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
    vars,
  });
}

export const AppColors = createColorTheme({
  body: {
    primary: {
      foreground: "oklch(0.2 0 0)",
      background: "oklch(1 0 0)",
    },
    secondary: {
      foreground: "oklch(0.6 0 0)",
      background: "oklch(0.975 0 0)",
    },
  },
  solid: {
    orange: {
      background: "oklch(0.573242 0.153125 50)",
      foreground: "oklch(1 0 0)",
      backgroundHover: "oklch(0.523242 0.153125 50)",
    },
  },
  light: {
    teal: {
      background: "oklch(0.96 0.03 190)",
      foreground: "oklch(0.6 0.14 190)",
      backgroundHover: "oklch(0.93 0.04 190)",
    },
    orange: {
      background: "oklch(0.96 0.03 50)",
      foreground: "oklch(0.7 0.21 50)",
      borderPrimary: "oklch(0.7 0.2 50)",
      borderSecondary: "oklch(0.9 0.1 50)",
      backgroundHover: "oklch(0.93 0.04 50)",
    },
    red: {
      background: "oklch(0.96 0.04 25)",
      foreground: "oklch(0.67 0.275 25)",
      backgroundHover: "oklch(0.93 0.06 25)",
    },
  },
});
