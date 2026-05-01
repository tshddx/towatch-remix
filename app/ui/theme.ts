import { createTheme, theme } from 'remix/ui/theme'

const COMMIT_MONO_STACK =
  '"CommitMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export const AppTheme = createTheme({
  space: {
    none: '0px',
    px: '1px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  fontFamily: {
    sans: COMMIT_MONO_STACK,
    mono: COMMIT_MONO_STACK,
  },
  fontSize: {
    xxxs: '0px',
    xxs: '0px',
    xs: '0px',
    sm: '0px',
    md: '14px',
    lg: '0px',
    xl: '0px',
    xxl: '0px',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.65',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    meta: '0.06em',
    wide: '0.1em',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  control: {
    height: {
      sm: '28px',
      md: '32px',
      lg: '36px',
    },
  },
  surface: {
    lvl0: 'oklch(1 0 0)',
    lvl1: 'oklch(0.97 0 0)',
    lvl2: 'oklch(0.94 0 0)',
    lvl3: 'oklch(0.9 0 0)',
    lvl4: 'oklch(0.86 0 0)',
  },
  shadow: {
    xs: '0 1px 1px oklch(0 0 0 / 0.05)',
    sm: '0 1px 2px oklch(0 0 0 / 0.07)',
    md: '0 6px 18px oklch(0 0 0 / 0.08)',
    lg: '0 16px 34px oklch(0 0 0 / 0.10)',
    xl: '0 24px 52px oklch(0 0 0 / 0.14)',
  },
  colors: {
    text: {
      primary: 'oklch(0.1 0 0)',
      secondary: 'oklch(0.3 0 0)',
      muted: 'oklch(0.5 0 0)',
      link: 'oklch(0.55 0.2 250)',
    },
    border: {
      subtle: 'oklch(0.92 0 0)',
      default: 'oklch(0.85 0 0)',
      strong: 'oklch(0.7 0 0)',
    },
    focus: {
      ring: 'oklch(0.55 0.2 250)',
    },
    overlay: {
      scrim: 'oklch(0 0 0 / 0.28)',
    },
    action: {
      primary: {
        background: 'oklch(0.55 0.2 250)',
        backgroundHover: 'oklch(0.5 0.2 250)',
        backgroundActive: 'oklch(0.45 0.2 250)',
        foreground: 'oklch(1 0 0 / 0.95)',
        border: 'oklch(0.55 0.2 250)',
      },
      secondary: {
        background: 'oklch(1 0 0)',
        backgroundHover: 'oklch(0.97 0 0)',
        backgroundActive: 'oklch(0.94 0 0)',
        foreground: 'oklch(0.1 0 0)',
        border: 'oklch(0.85 0 0)',
      },
      danger: {
        background: 'oklch(0.6 0.22 25)',
        backgroundHover: 'oklch(0.55 0.22 25)',
        backgroundActive: 'oklch(0.5 0.22 25)',
        foreground: 'oklch(1 0 0 / 0.95)',
        border: 'oklch(0.6 0.22 25)',
      },
    },
  },
})

export { theme }
