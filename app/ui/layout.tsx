import { css, type RemixNode } from 'remix/ui'

import { routes } from '../routes.ts'
import type { CurrentUser } from '../utils/current-user.ts'
import { Document } from './document.tsx'

export interface LayoutProps {
  children?: RemixNode
  title?: string
  currentUser?: CurrentUser | null
}

const NARROW = '@media (max-width: 720px)'

export function Layout() {
  return ({ title, children, currentUser = null }: LayoutProps) => (
    <Document title={title}>
      <div
        mix={css({
          display: 'flex',
          minHeight: '100vh',
          [NARROW]: { flexDirection: 'column' },
        })}
      >
        <Sidebar currentUser={currentUser} />
        <main
          mix={css({
            flex: 1,
            padding: '32px 16px',
          })}
        >
          {children}
        </main>
      </div>
    </Document>
  )
}

function Sidebar() {
  return ({ currentUser }: { currentUser: CurrentUser | null }) => (
    <aside
      mix={css({
        flex: '0 0 240px',
        width: '240px',
        padding: '32px 16px',
        background: 'var(--surface-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        [NARROW]: { flex: '0 0 auto', width: '100%' },
      })}
    >
      <p
        mix={css({
          margin: 0,
          padding: '0 12px',
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: 1.5,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-primary)',
        })}
      >
        Towatch
      </p>
      <nav>
        <ul
          mix={css({
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          })}
        >
          <li>
            <NavLink href={routes.home.href()}>Home</NavLink>
          </li>
          {currentUser ? (
            <li>
              <SignOutButton />
            </li>
          ) : (
            <>
              <li>
                <NavLink href={routes.auth.login.index.href()}>Log in</NavLink>
              </li>
              <li>
                <NavLink href={routes.auth.signup.index.href()}>Sign up</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  )
}

function NavLink() {
  return ({ href, children }: { href: string; children: RemixNode }) => (
    <a
      href={href}
      mix={css({
        display: 'block',
        padding: '8px 12px',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        textDecoration: 'none',
        transition: 'background-color 150ms ease, color 150ms ease',
        '&:hover, &:focus-visible': {
          background: 'var(--surface-4)',
          color: 'var(--brand-blue)',
          outline: 'none',
        },
      })}
    >
      {children}
    </a>
  )
}

function SignOutButton() {
  return () => (
    <form method="post" action={routes.auth.signout.href()} mix={css({ margin: 0 })}>
      <button
        type="submit"
        mix={css({
          display: 'block',
          width: '100%',
          padding: '8px 12px',
          borderRadius: '8px',
          border: 'none',
          background: 'transparent',
          color: 'var(--text-primary)',
          textAlign: 'left',
          cursor: 'pointer',
          font: 'inherit',
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover, &:focus-visible': {
            background: 'var(--surface-4)',
            color: 'var(--brand-blue)',
            outline: 'none',
          },
        })}
      >
        Sign out
      </button>
    </form>
  )
}
