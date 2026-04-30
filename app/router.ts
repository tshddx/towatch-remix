import {
  createRouter,
  type AnyParams,
  type MiddlewareContext,
  type WithParams,
} from 'remix/fetch-router'
import { formData } from 'remix/form-data-middleware'
import { session } from 'remix/session-middleware'

import { assets } from './assets.ts'
import { auth } from './controllers/auth.tsx'
import { home } from './controllers/home.tsx'
import { signup } from './controllers/signup.tsx'
import { loadDatabase } from './middleware/load-database.ts'
import { sessionCookie, sessionStorage } from './middleware/session.ts'
import { routes } from './routes.ts'

export type RootMiddleware = [
  ReturnType<typeof formData>,
  ReturnType<typeof session>,
  ReturnType<typeof loadDatabase>,
]

export type AppContext<params extends AnyParams = AnyParams> = WithParams<
  MiddlewareContext<RootMiddleware>,
  params
>

const middleware: RootMiddleware = [
  formData(),
  session(sessionCookie, sessionStorage),
  loadDatabase(),
]

export const router = createRouter({ middleware })

router.get(routes.assets, async ({ request }) => {
  let response = await assets.fetch(request)
  return response ?? new Response('Not Found', { status: 404 })
})

router.map(routes.home, home)
router.map(routes.auth, auth)
router.map(routes.signup, signup)
