import { Database } from 'remix/data-table'
import type { BuildAction } from 'remix/fetch-router'
import { Session } from 'remix/session'
import { css } from 'remix/ui'

import { users } from '../data/schema.ts'
import type { AppContext } from '../router.ts'
import { routes } from '../routes.ts'
import { Layout } from '../ui/layout.tsx'
import { render } from '../utils/render.tsx'

interface HomePageProps {
  currentUser: { username: string } | null
}

export const home: BuildAction<'GET', typeof routes.home, AppContext> = {
  async handler({ get, request }) {
    let session = get(Session)
    let userIdValue = session.get('userId')

    let currentUser: HomePageProps['currentUser'] = null
    if (typeof userIdValue === 'number') {
      let db = get(Database)
      let user = await db.find(users, userIdValue)
      if (user) currentUser = { username: user.username }
    }

    return render(<HomePage currentUser={currentUser} />, request)
  },
}

function HomePage() {
  return ({ currentUser }: HomePageProps) => (
    <Layout title="Home">
      {currentUser ? (
        <p mix={css({ margin: 0, fontSize: '16px', lineHeight: 1.5 })}>
          Signed in as <strong>{currentUser.username}</strong>.
        </p>
      ) : (
        <p mix={css({ margin: 0, fontSize: '16px', lineHeight: 1.5 })}>
          Not signed in.{' '}
          <a
            href={routes.auth.signup.index.href()}
            mix={css({
              color: 'var(--brand-blue)',
              textDecoration: 'none',
              '&:hover, &:focus-visible': { textDecoration: 'underline', outline: 'none' },
            })}
          >
            Sign up
          </a>{' '}
          to get started.
        </p>
      )}
    </Layout>
  )
}
