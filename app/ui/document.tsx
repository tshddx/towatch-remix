import { css, type RemixNode } from 'remix/ui'

import { routes } from '../routes.ts'

const APP_DISPLAY_NAME = decodeURIComponent('Towatch%20Remix')

const FONT_STACK =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"

export interface DocumentProps {
  children?: RemixNode
  title?: string
}

export function Document() {
  return ({ title, children }: DocumentProps) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>{title ? `${title} · ${APP_DISPLAY_NAME}` : APP_DISPLAY_NAME}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
        />
      </head>
      <body
        mix={css({
          '--surface-0': '#dee2e6',
          '--surface-3': '#f0f4f7',
          '--surface-4': '#f7fbff',
          '--text-primary': '#313539',
          '--text-tertiary': '#94989c',
          '--brand-blue': '#2dacf9',
          '@media (prefers-color-scheme: dark)': {
            '--surface-0': '#1e2226',
            '--surface-3': '#313539',
            '--surface-4': '#363a3e',
            '--text-primary': '#dee2e6',
            '--text-tertiary': '#94989c',
          },
          '& *, & *::before, & *::after': { boxSizing: 'border-box' },
          margin: 0,
          minHeight: '100vh',
          background: 'var(--surface-0)',
          color: 'var(--text-primary)',
          fontFamily: FONT_STACK,
          fontSize: '14px',
          lineHeight: 1.5,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        })}
      >
        {children}
        <script type="module" src={routes.assets.href({ path: 'app/assets/entry.ts' })}></script>
      </body>
    </html>
  )
}
