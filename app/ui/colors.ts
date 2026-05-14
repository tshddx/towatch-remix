import { createElement, type Handle } from "remix/ui";

import { darkColorValues } from "./dark-colors.ts";

export const colorVariableNames = {
  bodyText1: "--app-body-text-1",
  bodyText2: "--app-body-text-2",
  bodyText3: "--app-body-text-3",
  bodyBg1: "--app-body-bg-1",
  bodyBg2: "--app-body-bg-2",
  border1: "--app-border-1",
  border2: "--app-border-2",
  border3: "--app-border-3",
  focusRing: "--app-focus-ring",
  overlayScrim: "--app-overlay-scrim",
  solidOrangeBg1: "--app-solid-orange-bg-1",
  solidOrangeBg2: "--app-solid-orange-bg-2",
  solidOrangeText: "--app-solid-orange-text",
  solidTealBg1: "--app-solid-teal-bg-1",
  solidTealBg2: "--app-solid-teal-bg-2",
  solidTealText: "--app-solid-teal-text",
  lightTealBg1: "--app-light-teal-bg-1",
  lightTealBg2: "--app-light-teal-bg-2",
  lightTealText: "--app-light-teal-text",
  lightOrangeBg1: "--app-light-orange-bg-1",
  lightOrangeBg2: "--app-light-orange-bg-2",
  lightOrangeText: "--app-light-orange-text",
  lightOrangeBorder1: "--app-light-orange-border-1",
  lightOrangeBorder2: "--app-light-orange-border-2",
  lightRedBg1: "--app-light-red-bg-1",
  lightRedBg2: "--app-light-red-bg-2",
  lightRedText: "--app-light-red-text",
} as const;

export type ColorValues = { [K in keyof typeof colorVariableNames]: string };
export type ColorTokens = { [K in keyof typeof colorVariableNames]: string };

export interface CreateColorThemeOptions {
  darkValues?: ColorValues;
  selector?: string;
}

export interface ColorThemeStyleProps {
  nonce?: string;
}

export interface ColorOverrideStyleProps {
  nonce?: string;
  requestUrl: string;
}

const OKLCH_QUERY_VALUE =
  /^oklch\(\d+(?:\.\d+)?_\d+(?:\.\d+)?_\d+(?:\.\d+)?\)$/;

function collectVars(values: ColorValues): Record<string, string> {
  let out: Record<string, string> = {};
  for (let [key, variableName] of Object.entries(colorVariableNames)) {
    let value = values[key as keyof ColorValues];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new TypeError(
        `Expected color value at "${key}" to be a string or number`,
      );
    }
    out[variableName] = String(value);
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

export const colors = Object.fromEntries(
  Object.entries(colorVariableNames).map(([key, variableName]) => [
    key,
    `var(${variableName})`,
  ]),
) as ColorTokens;

export function createColorOverrideCss(requestUrl: string): string | null {
  let params = new URL(requestUrl).searchParams;
  let vars: Record<string, string> = {};

  for (let [key, variableName] of Object.entries(colorVariableNames)) {
    let value = params.get(key);
    if (value == null || !OKLCH_QUERY_VALUE.test(value)) continue;
    vars[variableName] = value.replaceAll("_", " ");
  }

  if (Object.keys(vars).length === 0) return null;
  return `:root {\n${formatVars(vars)}\n}`;
}

export function ColorOverrideStyle(handle: Handle<ColorOverrideStyleProps>) {
  return () => {
    let cssText = createColorOverrideCss(handle.props.requestUrl);
    if (cssText == null) return null;

    return createElement("style", {
      nonce: handle.props.nonce,
      "data-app-color-overrides": "",
      innerHTML: escapeStyleText(cssText),
    });
  };
}

export function createColorTheme(
  values: ColorValues,
  options: CreateColorThemeOptions = {},
) {
  let selector = options.selector ?? ":root";
  let vars = Object.freeze(collectVars(values));
  let darkValues = options.darkValues;
  let darkVars =
    darkValues == null ? undefined : Object.freeze(collectVars(darkValues));
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
  bodyText1: "oklch(0.2 0.0489 190)",
  bodyText2: "oklch(0.6 0.01 190)",
  bodyText3: "oklch(0.85 0.01 190)",
  bodyBg1: "oklch(0.985 0.006 190)",
  bodyBg2: "oklch(0.945 0.006 190)",
  border1: "oklch(0.9 0 0)",
  border2: "oklch(0.75 0 0)",
  border3: "oklch(0.5 0 0)",
  focusRing: "oklch(0.55 0.2 250)",
  overlayScrim: "oklch(0 0 0 / 0.28)",
  solidOrangeBg1: "oklch(0.573242 0.153125 50)",
  solidOrangeBg2: "oklch(0.523242 0.153125 50)",
  solidOrangeText: "oklch(1 0 0)",
  solidTealBg1: "oklch(0.58 0.135 190)",
  solidTealBg2: "oklch(0.53 0.135 190)",
  solidTealText: "oklch(1 0 0)",
  lightTealBg1: "oklch(0.935 0.03 190)",
  lightTealBg2: "oklch(0.92 0.04 190)",
  lightTealText: "oklch(0.6 0.14 190)",
  lightOrangeBg1: "oklch(0.94 0.03 50)",
  lightOrangeBg2: "oklch(0.92 0.03 50)",
  lightOrangeText: "oklch(0.7 0.21 50)",
  lightOrangeBorder1: "oklch(0.7 0.2 50)",
  lightOrangeBorder2: "oklch(0.9 0.1 50)",
  lightRedBg1: "oklch(0.945 0.04 25)",
  lightRedBg2: "oklch(0.93 0.06 25)",
  lightRedText: "oklch(0.67 0.275 25)",
} satisfies ColorValues;

export const AppColors = createColorTheme(lightColorValues, {
  darkValues: darkColorValues,
});
