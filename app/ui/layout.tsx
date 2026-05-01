import { css, type RemixNode } from "remix/ui";

import { routes } from "../routes.ts";
import type { CurrentUser } from "../utils/current-user.ts";
import { Document } from "./document.tsx";
import { theme } from "./theme.ts";

export interface LayoutProps {
  children?: RemixNode;
  title?: string;
  currentUser?: CurrentUser | null;
}

const NARROW = "@media (max-width: 720px)";

export function Layout() {
  return ({ title, children, currentUser = null }: LayoutProps) => (
    <Document title={title}>
      <div
        mix={css({
          display: "flex",
          minHeight: "100vh",
          [NARROW]: { flexDirection: "column" },
        })}
      >
        <Sidebar currentUser={currentUser} />
        <main
          mix={css({
            flex: 1,
            padding: `${theme.space.xxl} ${theme.space.lg}`,
          })}
        >
          {children}
        </main>
      </div>
    </Document>
  );
}

function Sidebar() {
  return ({ currentUser }: { currentUser: CurrentUser | null }) => (
    <aside
      mix={css({
        flex: "0 0 240px",
        width: "240px",
        padding: `${theme.space.xxl} ${theme.space.lg}`,
        background: theme.surface.lvl3,
        display: "flex",
        flexDirection: "column",
        gap: theme.space.xxl,
        [NARROW]: { flex: "0 0 auto", width: "100%" },
      })}
    >
      <p
        mix={css({
          margin: 0,
          padding: `0 ${theme.space.md}`,
          fontWeight: theme.fontWeight.bold,
          lineHeight: theme.lineHeight.normal,
          textTransform: "uppercase",
          letterSpacing: theme.letterSpacing.wide,
          color: theme.colors.text.primary,
        })}
      >
        Towatch
      </p>
      <nav>
        <ul
          mix={css({
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: theme.space.xs,
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
  );
}

function NavLink() {
  return ({ href, children }: { href: string; children: RemixNode }) => (
    <a
      href={href}
      mix={css({
        display: "block",
        padding: `${theme.space.sm} ${theme.space.md}`,
        borderRadius: theme.radius.md,
        color: theme.colors.text.primary,
        textDecoration: "none",
        transition: "background-color 150ms ease, color 150ms ease",
        "&:hover, &:focus-visible": {
          background: theme.surface.lvl4,
          color: theme.colors.text.link,
          outline: "none",
        },
      })}
    >
      {children}
    </a>
  );
}

function SignOutButton() {
  return () => (
    <form method="post" action={routes.auth.signout.href()} mix={css({ margin: 0 })}>
      <button
        type="submit"
        mix={css({
          display: "block",
          width: "100%",
          padding: `${theme.space.sm} ${theme.space.md}`,
          borderRadius: theme.radius.md,
          border: "none",
          background: "transparent",
          color: theme.colors.text.primary,
          textAlign: "left",
          cursor: "pointer",
          font: "inherit",
          transition: "background-color 150ms ease, color 150ms ease",
          "&:hover, &:focus-visible": {
            background: theme.surface.lvl4,
            color: theme.colors.text.link,
            outline: "none",
          },
        })}
      >
        Sign out
      </button>
    </form>
  );
}
