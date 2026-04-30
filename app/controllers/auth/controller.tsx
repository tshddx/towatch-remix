import type { Controller } from 'remix/fetch-router'

import type { AppContext } from '../../router.ts'
import type { routes } from '../../routes.ts'
import { Layout } from '../../ui/layout.tsx'
import { render } from '../../utils/render.tsx'
import { signup } from './signup/controller.tsx'

export const auth = {
  actions: {
    index({ request }) {
      return render(<AuthPage />, request)
    },
    signup,
  },
} satisfies Controller<typeof routes.auth, AppContext>

function AuthPage() {
  return () => (
    <Layout title="Auth">
      <h1>Auth</h1>
      <p>Use this route to start building sign-in, sign-up, and session flows.</p>
    </Layout>
  )
}
