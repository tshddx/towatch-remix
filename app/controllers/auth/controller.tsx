import type { Controller } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";
import { Session } from "remix/session";

import type { AppContext } from "../../router.ts";
import { routes } from "../../routes.ts";
import { login } from "./login/controller.tsx";
import { signup } from "./signup/controller.tsx";

export const auth = {
  actions: {
    login,
    signup,
    signout({ get }) {
      let session = get(Session);
      session.unset("userId");
      session.regenerateId(true);
      return redirect(routes.home.href(), 303);
    },
  },
} satisfies Controller<typeof routes.auth, AppContext>;
