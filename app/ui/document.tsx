import { css, type RemixNode } from "remix/ui";

import { routes } from "../routes.ts";
import { AppTheme, theme } from "./theme.ts";

const APP_DISPLAY_NAME = decodeURIComponent("Towatch%20Remix");

const COMMIT_MONO_FACES = `
@font-face {
  font-family: 'CommitMono';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/CommitMono-VF.woff2') format('woff2');
}
@font-face {
  font-family: 'CommitMono';
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/CommitMono-VF.woff2') format('woff2');
  font-variation-settings: 'ital' 1;
}
`;

export interface DocumentProps {
  children?: RemixNode;
  title?: string;
}

export function Document() {
  return ({ title, children }: DocumentProps) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title ? `${title} · ${APP_DISPLAY_NAME}` : APP_DISPLAY_NAME}</title>
        <style>{COMMIT_MONO_FACES}</style>
        <AppTheme.Style />
      </head>
      <body
        mix={css({
          "& *, & *::before, & *::after": { boxSizing: "border-box" },
          '& [role="alert"]': {
            color: theme.colors.action.danger.foreground,
            fontWeight: theme.fontWeight.bold,
          },
          margin: 0,
          minHeight: "100vh",
          background: theme.surface.lvl0,
          color: theme.colors.text.primary,
          fontFamily: theme.fontFamily.mono,
          fontSize: theme.fontSize.md,
          fontFeatureSettings:
            "'ss04' on, 'ss05' on, 'cv02' on, 'cv03' on, 'cv04' on, 'cv05' on, 'cv06' on",
          lineHeight: theme.lineHeight.normal,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        })}
      >
        {children}
        <script type="module" src={routes.assets.href({ path: "app/assets/entry.ts" })}></script>
      </body>
    </html>
  );
}
