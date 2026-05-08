# Towatch Remix

A minimal Remix application starter with a home page and an auth page.

## Starter Shape

- `app/controllers/home.tsx` owns the home page.
- `app/controllers/auth.tsx` owns the auth page.
- `app/routes.ts` defines the route contract.
- `app/router.ts` wires routes to handlers.
- `app/ui/` holds the shared document and layout wrappers.
- `app/utils/render.tsx` centralizes HTML response rendering.

## Growing The App

- Start with flat route files and only introduce route folders when a route needs multiple actions or route-owned modules.
- Add directories like `app/data/`, `app/middleware/`, `public/`, or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run start
npm test
npm run lint:fix
```

## Deploying To Fly.io

This app uses SQLite and filesystem sessions, so deploy it with a persistent Fly volume mounted at `/data`.

```sh
fly apps create <app-name>
fly volumes create data --size 1 --region iad -a <app-name>
fly secrets set SESSION_SECRET="$(openssl rand -base64 32)" -a <app-name>
fly deploy -a <app-name>
```

Change `primary_region` in `fly.toml` and the `--region` value above if you want the app hosted somewhere other than IAD.
