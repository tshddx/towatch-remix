import { Database } from "remix/data-table";
import * as s from "remix/data-schema";
import { maxLength, minLength } from "remix/data-schema/checks";
import * as f from "remix/data-schema/form-data";
import type { Controller } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";
import { Session } from "remix/session";
import { css } from "remix/ui";

import { hashPassword } from "../../../data/passwords.ts";
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

const USERNAME_PATTERN = /^[A-Za-z0-9](?:-?[A-Za-z0-9])*$/;
const USERNAME_FORMAT_MESSAGE =
  "Username may only contain ASCII letters, numbers, and single dashes, and must start and end with a letter or number.";

const passwordSchema = s.string().pipe(minLength(5)).pipe(maxLength(200));

const signupSchema = f.object({
  username: f.field(
    s
      .string()
      .pipe(minLength(2))
      .pipe(maxLength(20))
      .refine((value) => USERNAME_PATTERN.test(value), USERNAME_FORMAT_MESSAGE),
  ),
  password: f.field(passwordSchema),
  password_confirm: f.field(passwordSchema),
});

type SignupFieldErrors = Partial<
  Record<"username" | "password" | "password_confirm" | "form", string>
>;

interface SignupPageProps {
  currentUser: CurrentUser | null;
  requestUrl: string;
  values?: { username?: string };
  errors?: SignupFieldErrors;
}

export const signup = {
  actions: {
    async index({ get, request }) {
      let currentUser = await loadCurrentUser(get(Database), get(Session));
      return render(
        <SignupPage currentUser={currentUser} requestUrl={request.url} />,
        request,
      );
    },

    async action({ get, request }) {
      let currentUser = await loadCurrentUser(get(Database), get(Session));
      let formData = get(FormData);
      let parsed = s.parseSafe(signupSchema, formData);

      if (!parsed.success) {
        return render(
          <SignupPage
            currentUser={currentUser}
            requestUrl={request.url}
            values={readSignupValues(formData)}
            errors={collectFieldErrors(parsed.issues)}
          />,
          request,
          { status: 400 },
        );
      }

      if (parsed.value.password !== parsed.value.password_confirm) {
        return render(
          <SignupPage
            currentUser={currentUser}
            requestUrl={request.url}
            values={readSignupValues(formData)}
            errors={{ password_confirm: "Passwords do not match." }}
          />,
          request,
          { status: 400 },
        );
      }

      let usernameLower = parsed.value.username.toLowerCase();

      let db = get(Database);
      let existing = await db.findOne(users, {
        where: { username_lower: usernameLower },
      });
      if (existing) {
        return render(
          <SignupPage
            currentUser={currentUser}
            requestUrl={request.url}
            values={readSignupValues(formData)}
            errors={{ username: "That username is already taken." }}
          />,
          request,
          { status: 409 },
        );
      }

      let user = await db.create(
        users,
        {
          username: parsed.value.username,
          username_lower: usernameLower,
          password_hash: await hashPassword(parsed.value.password),
          created_at: Date.now(),
        },
        { returnRow: true },
      );

      let session = get(Session);
      session.regenerateId(true);
      session.set("userId", user.id);
      session.flash("message", `Welcome, ${user.username}!`);

      return redirect(routes.home.href(), 303);
    },
  },
} satisfies Controller<typeof routes.auth.signup, AppContext>;

function readSignupValues(formData: FormData): SignupPageProps["values"] {
  return {
    username: stringOrUndefined(formData.get("username")),
  };
}

function stringOrUndefined(
  value: FormDataEntryValue | null,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function collectFieldErrors(issues: ReadonlyArray<s.Issue>): SignupFieldErrors {
  let errors: SignupFieldErrors = {};
  for (let issue of issues) {
    let key = issue.path?.[0];
    if (
      key === "username" ||
      key === "password" ||
      key === "password_confirm"
    ) {
      errors[key] ??= issue.message;
    } else {
      errors.form ??= issue.message;
    }
  }
  return errors;
}

function SignupPage() {
  return ({
    currentUser,
    requestUrl,
    values = {},
    errors = {},
  }: SignupPageProps) => (
    <Layout title="Sign up" currentUser={currentUser} requestUrl={requestUrl}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading>Create Your Account</Heading>
        {errors.form ? <p role="alert">{errors.form}</p> : null}
        <Form method="post" action={routes.auth.signup.action.href()}>
          <TextField
            label="Username"
            type="text"
            name="username"
            value={values.username ?? ""}
            required
            minLength={2}
            maxLength={20}
            pattern="[A-Za-z0-9]([A-Za-z0-9]|-(?!-))*[A-Za-z0-9]"
            autoComplete="username"
            autoCapitalize="off"
            autoCorrect="off"
            spellcheck={false}
            error={errors.username}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            required
            minLength={5}
            autoComplete="new-password"
            error={errors.password}
          />
          <TextField
            label="Confirm password"
            type="password"
            name="password_confirm"
            required
            minLength={5}
            autoComplete="new-password"
            error={errors.password_confirm}
          />
          <Button type="submit" size="lg">
            Sign up
          </Button>
        </Form>
      </div>
    </Layout>
  );
}
