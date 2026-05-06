import {
  createRouter,
  type AnyParams,
  type MiddlewareContext,
  type WithParams,
} from "remix/fetch-router";
import { formData } from "remix/form-data-middleware";
import { session } from "remix/session-middleware";
import { staticFiles } from "remix/static-middleware";

import { assets } from "./assets.ts";
import { auth } from "./controllers/auth/controller.tsx";
import { designGuide } from "./controllers/design-guide.tsx";
import { home } from "./controllers/home.tsx";
import { movieController } from "./controllers/movies/controller.tsx";
import { personController } from "./controllers/people/controller.tsx";
import { loadDatabase } from "./middleware/load-database.ts";
import { sessionCookie, sessionStorage } from "./middleware/session.ts";
import { routes } from "./routes.ts";

export type RootMiddleware = [
  ReturnType<typeof staticFiles>,
  ReturnType<typeof formData>,
  ReturnType<typeof session>,
  ReturnType<typeof loadDatabase>,
];

export type AppContext<params extends AnyParams = AnyParams> = WithParams<
  MiddlewareContext<RootMiddleware>,
  params
>;

const middleware: RootMiddleware = [
  staticFiles("./public"),
  formData(),
  session(sessionCookie, sessionStorage),
  loadDatabase(),
];

export const router = createRouter({ middleware });

router.get(routes.assets, async ({ request }) => {
  let response = await assets.fetch(request);
  return response ?? new Response("Not Found", { status: 404 });
});

router.map(routes.home, home);
router.map(routes.designGuide, designGuide);
router.map(routes.movies, movieController);
router.map(routes.people, personController);
router.map(routes.auth, auth);
