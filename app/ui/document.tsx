import { css, type RemixNode } from "remix/ui";

import { routes } from "../routes.ts";
import { AppColors, colors } from "./colors.ts";
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

const APP_RESET = `
@layer app-reset, rmx;

@layer app-reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
  }

  :where(h1, h2, h3, h4, h5, h6, p, ul, ol, dl, figure, blockquote) {
    margin: 0;
  }

  :where(img, svg) {
    display: block;
  }
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>
          {title ? `${title} · ${APP_DISPLAY_NAME}` : APP_DISPLAY_NAME}
        </title>
        <style>{COMMIT_MONO_FACES}</style>
        <style>{APP_RESET}</style>
        <AppTheme.Style />
        <AppColors.Style />
      </head>
      <body
        mix={css({
          "& *, & *::before, & *::after": { boxSizing: "border-box" },
          '& [role="alert"]': {
            color: colors.lightRedText,
            fontWeight: theme.fontWeight.bold,
          },
          "& dl": {
            display: "grid",
            gridTemplateColumns: "repeat(2, auto)",
            justifyContent: "start",
            columnGap: "1ch",
            rowGap: 0,
            margin: 0,
          },
          "& dt, & dd": {
            maxWidth: "30ch",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "fit-content",
          },
          "& dt": {
            color: colors.bodyText2,
          },
          "& dd": {
            margin: 0,
          },
          margin: 0,
          minHeight: "100vh",
          background: colors.bodyBg1,
          color: colors.bodyText1,
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
        <script
          type="module"
          src={routes.assets.href({ path: "app/assets/entry.ts" })}
        ></script>
      </body>
    </html>
  );
}
