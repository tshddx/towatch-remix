# Towatch Remix Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run start
npm test
npm run lint:fix
npm run fmt
```

Prefer `npm run lint:fix` over `npm run lint` so any auto-fixable issues are repaired in the same step instead of leaving them for a follow-up. `npm run fmt` already writes fixes; `fmt:check` is the CI-only verify variant.

`oxlint` runs with `typeAware: true` and `typeCheck: true` (see `.oxlintrc.json`), so it reports TypeScript type errors alongside lint findings — there's no separate `tsc --noEmit` step.

## Building Features

Refer to ./agents/skills/remix/SKILL.md

## Starter Layout

- `app/controllers/home.tsx` owns the home page
- `app/controllers/auth.tsx` owns the auth page
- `app/routes.ts` defines the route contract
- `app/router.ts` wires routes to route handlers
- `app/ui/` holds the shared document and layout wrappers
- `app/utils/render.tsx` centralizes HTML response rendering

## Route Ownership

- Start from `app/routes.ts` and map each route to the narrowest owner on disk.
- Keep simple pages in flat files like `app/controllers/home.tsx` and `app/controllers/auth.tsx`.
- Promote a route into a controller folder with `controller.tsx` only when it gains nested routes, multiple actions, or route-owned modules.
- Keep route-owned page modules next to the route that owns them.
- Move shared UI to `app/ui/`, not `app/controllers/`.

## Build-Out Notes

- This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `public/`, and `test/` only when you need them.
- Prefer putting code in the narrowest owner before introducing shared modules.
- Avoid generic dumping-ground directories like `app/lib/` or `app/components/`.

## Spacing Units

- Use `ch` for horizontal sizes (gaps, padding-inline, widths).
- Use `lh` for vertical sizes (gaps, padding-block, heights).
- Don't use `theme.space.*`. The contract requires those slots, but the codebase has settled on `ch`/`lh` as the unit system because they tie spacing to the monospace font's character grid and line height.
- Hardcoded `px` values are fine for hairline borders (`1px solid …`).

## Colors

- Use `colors` from `app/ui/colors.ts` for app color values instead of hardcoded color literals in component styles.
- Add or adjust color tokens through `AppColors` / `createColorTheme` in `app/ui/colors.ts`; `Document` installs the generated CSS variables with `<AppColors.Style />`.
- Keep semantic usage aligned with the contract: `body.primary`, `body.secondary`, `solid.*`, and `light.*` are the current groups.

## Verifying Changes

- Don't manually start the dev server (`npm run dev` / `npm run start`) to verify changes — the user may already have one running, and it pollutes local state.
- Use `npm test` and `npm run lint:fix` for fast, deterministic feedback. `lint:fix` includes type checking via oxlint's type-aware mode.
- If runtime verification is essential, ask the user to exercise the change and report back rather than booting the server yourself.

## Linting and Formatting

- [`oxlint`](https://oxc.rs) handles linting (configured in `.oxlintrc.json` with type-aware mode); [`oxfmt`](https://oxc.rs) handles formatting with default configuration.
- `npm run lint` to check, `npm run lint:fix` to apply safe fixes. Prefer `lint:fix` while iterating so auto-fixable issues are resolved in one shot.
- `npm run fmt` to format, `npm run fmt:check` to verify formatting in CI / pre-commit.
