import { Database } from "remix/data-table";
import * as s from "remix/data-schema";
import { minLength } from "remix/data-schema/checks";
import * as f from "remix/data-schema/form-data";
import type { Controller } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";
import { Session } from "remix/session";
import { css } from "remix/ui";

import { verifyPassword } from "../../../data/passwords.ts";
import { users } from "../../../data/schema.ts";
import type { AppContext } from "../../../router.ts";
import { routes } from "../../../routes.ts";
import { Button } from "../../../ui/button.tsx";
import { Form } from "../../../ui/form.tsx";
import { Heading } from "../../../ui/heading.tsx";
import { Layout } from "../../../ui/layout.tsx";
import { TextField } from "../../../ui/text-field.tsx";
import {
  loadCurrentUser,
  type CurrentUser,
} from "../../../utils/current-user.ts";
import { render } from "../../../utils/render.tsx";

const loginSchema = f.object({
  username: f.field(s.string().pipe(minLength(1))),
  password: f.field(s.string().pipe(minLength(1))),
});

interface LoginPageProps {
  currentUser: CurrentUser | null;
  requestUrl: string;
  values?: { username?: string };
  error?: string;
}

export const login = {
  actions: {
    async index({ get, request }) {
      let currentUser = await loadCurrentUser(get(Database), get(Session));
      return render(
        <LoginPage currentUser={currentUser} requestUrl={request.url} />,
        request,
      );
    },

    async action({ get, request }) {
      let currentUser = await loadCurrentUser(get(Database), get(Session));
      let formData = get(FormData);
      let parsed = s.parseSafe(loginSchema, formData);

      if (!parsed.success) {
        return render(
          <LoginPage
            currentUser={currentUser}
            requestUrl={request.url}
            values={readLoginValues(formData)}
            error="Username and password are required."
          />,
          request,
          { status: 400 },
        );
      }

      let usernameLower = parsed.value.username.toLowerCase();
      let db = get(Database);
      let user = await db.findOne(users, {
        where: { username_lower: usernameLower },
      });
      if (
        !user ||
        !(await verifyPassword(parsed.value.password, user.password_hash))
      ) {
        return render(
          <LoginPage
            currentUser={currentUser}
            requestUrl={request.url}
            values={readLoginValues(formData)}
            error="Invalid username or password."
          />,
          request,
          { status: 401 },
        );
      }

      let session = get(Session);
      session.regenerateId(true);
      session.set("userId", user.id);
      session.flash("message", `Welcome back, ${user.username}!`);

      return redirect(routes.home.href(), 303);
    },
  },
} satisfies Controller<typeof routes.auth.login, AppContext>;

function readLoginValues(formData: FormData): LoginPageProps["values"] {
  return {
    username: stringOrUndefined(formData.get("username")),
  };
}

function stringOrUndefined(
  value: FormDataEntryValue | null,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function LoginPage() {
  return ({ currentUser, requestUrl, values = {}, error }: LoginPageProps) => (
    <Layout title="Log in" currentUser={currentUser} requestUrl={requestUrl}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading>Log In</Heading>
        {error ? <p role="alert">{error}</p> : null}
        <Form method="post" action={routes.auth.login.action.href()}>
          <TextField
            label="Username"
            type="text"
            name="username"
            value={values.username ?? ""}
            required
            autoComplete="username"
            autoCapitalize="off"
            autoCorrect="off"
            spellcheck={false}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
          <Button type="submit" size="lg">
            Log in
          </Button>
        </Form>
      </div>
    </Layout>
  );
}
