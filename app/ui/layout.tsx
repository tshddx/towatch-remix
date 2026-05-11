import { css, type RemixNode } from "remix/ui";

import { routes } from "../routes.ts";
import type { CurrentUser } from "../utils/current-user.ts";
import { Document } from "./document.tsx";
import { Heading } from "./heading.tsx";
import { InlineLink } from "./inline-link.tsx";
import { Link } from "./link.tsx";
import { colors } from "./colors.ts";
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
            padding: "1lh 1ch",
            paddingRight: "max(1ch, env(safe-area-inset-right))",
            [NARROW]: {
              paddingLeft: "max(1ch, env(safe-area-inset-left))",
            },
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
        flex: "0 0 18ch",
        width: "18ch",
        padding: "1lh 1ch",
        paddingLeft: "max(1ch, env(safe-area-inset-left))",
        background: colors.body.secondary.background,
        display: "flex",
        flexDirection: "column",
        gap: "1lh",
        [NARROW]: {
          flex: "0 0 auto",
          width: "100%",
          paddingRight: "max(1ch, env(safe-area-inset-right))",
        },
      })}
    >
      <nav
        mix={css({
          [NARROW]: { width: "100%" },
        })}
      >
        <ul
          mix={css({
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1lh",
            [NARROW]: {
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "1lh 3ch",
            },
          })}
        >
          <li>
            <Heading level={3}>
              <InlineLink href={routes.home.href()}>TOWATCH</InlineLink>
            </Heading>
          </li>
          <li
            mix={css({
              [NARROW]: {
                marginLeft: "auto",
              },
            })}
          >
            <Link href={routes.movies.index.href()}>Movies</Link>
          </li>
          <li>
            <Link href={routes.people.index.href()}>People</Link>
          </li>
          {currentUser ? (
            <li>
              <SignOutButton />
            </li>
          ) : (
            <>
              <li>
                <Link href={routes.auth.login.index.href()}>Log In</Link>
              </li>
              <li>
                <Link href={routes.auth.signup.index.href()}>Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
}

function SignOutButton() {
  return () => (
    <form
      method="post"
      action={routes.auth.signout.href()}
      mix={css({ margin: 0 })}
    >
      <button
        type="submit"
        mix={css({
          padding: 0,
          border: "none",
          background: "transparent",
          color: colors.light.orange.foreground,
          cursor: "pointer",
          font: "inherit",
          fontWeight: theme.fontWeight.bold,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            textDecorationColor: colors.light.orange.borderPrimary,
            textDecorationSkipInk: "none",
            textUnderlineOffset: "0.24ch",
          },
        })}
      >
        Sign Out
      </button>
    </form>
  );
}
