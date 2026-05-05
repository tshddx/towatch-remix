import { Database } from "remix/data-table";
import type { BuildAction } from "remix/fetch-router";
import { Session } from "remix/session";
import { css } from "remix/ui";

import type { AppContext } from "../router.ts";
import { routes } from "../routes.ts";
import { Layout } from "../ui/layout.tsx";
import { Link } from "../ui/link.tsx";
import { loadCurrentUser, type CurrentUser } from "../utils/current-user.ts";
import { render } from "../utils/render.tsx";

interface HomePageProps {
  currentUser: CurrentUser | null;
}

export const home: BuildAction<"GET", typeof routes.home, AppContext> = {
  async handler({ get, request }) {
    let currentUser = await loadCurrentUser(get(Database), get(Session));
    return render(<HomePage currentUser={currentUser} />, request);
  },
};

function HomePage() {
  return ({ currentUser }: HomePageProps) => (
    <Layout title="Home" currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        {currentUser ? (
          <p mix={css({ margin: 0 })}>
            Signed in as <strong>{currentUser.username}</strong>.
          </p>
        ) : (
          <p mix={css({ margin: 0 })}>
            Not signed in. <Link href={routes.auth.signup.index.href()}>Sign up</Link> to get
            started.
          </p>
        )}
      </div>
    </Layout>
  );
}
