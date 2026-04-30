import { Database } from 'remix/data-table'
import * as s from 'remix/data-schema'
import { maxLength, minLength } from 'remix/data-schema/checks'
import * as f from 'remix/data-schema/form-data'
import type { Controller } from 'remix/fetch-router'
import { redirect } from 'remix/response/redirect'
import { Session } from 'remix/session'

import { hashPassword } from '../../../data/passwords.ts'
import { users } from '../../../data/schema.ts'
import type { AppContext } from '../../../router.ts'
import { routes } from '../../../routes.ts'
import { Layout } from '../../../ui/layout.tsx'
import { loadCurrentUser, type CurrentUser } from '../../../utils/current-user.ts'
import { render } from '../../../utils/render.tsx'

const USERNAME_PATTERN = /^[A-Za-z0-9](?:-?[A-Za-z0-9])*$/
const USERNAME_FORMAT_MESSAGE =
  'Username may only contain ASCII letters, numbers, and single dashes, and must start and end with a letter or number.'

const passwordSchema = s.string().pipe(minLength(8)).pipe(maxLength(200))

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
})

type SignupFieldErrors = Partial<
  Record<'username' | 'password' | 'password_confirm' | 'form', string>
>

interface SignupPageProps {
  currentUser: CurrentUser | null
  values?: { username?: string }
  errors?: SignupFieldErrors
}

export const signup = {
  actions: {
    async index({ get, request }) {
      let currentUser = await loadCurrentUser(get(Database), get(Session))
      return render(<SignupPage currentUser={currentUser} />, request)
    },

    async action({ get, request }) {
      let currentUser = await loadCurrentUser(get(Database), get(Session))
      let formData = get(FormData)
      let parsed = s.parseSafe(signupSchema, formData)

      if (!parsed.success) {
        return render(
          <SignupPage
            currentUser={currentUser}
            values={readSignupValues(formData)}
            errors={collectFieldErrors(parsed.issues)}
          />,
          request,
          { status: 400 },
        )
      }

      if (parsed.value.password !== parsed.value.password_confirm) {
        return render(
          <SignupPage
            currentUser={currentUser}
            values={readSignupValues(formData)}
            errors={{ password_confirm: 'Passwords do not match.' }}
          />,
          request,
          { status: 400 },
        )
      }

      let usernameLower = parsed.value.username.toLowerCase()

      let db = get(Database)
      let existing = await db.findOne(users, { where: { username_lower: usernameLower } })
      if (existing) {
        return render(
          <SignupPage
            currentUser={currentUser}
            values={readSignupValues(formData)}
            errors={{ username: 'That username is already taken.' }}
          />,
          request,
          { status: 409 },
        )
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
      )

      let session = get(Session)
      session.regenerateId(true)
      session.set('userId', user.id)
      session.flash('message', `Welcome, ${user.username}!`)

      return redirect(routes.home.href(), 303)
    },
  },
} satisfies Controller<typeof routes.auth.signup, AppContext>

function readSignupValues(formData: FormData): SignupPageProps['values'] {
  return {
    username: stringOrUndefined(formData.get('username')),
  }
}

function stringOrUndefined(value: FormDataEntryValue | null): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function collectFieldErrors(issues: ReadonlyArray<s.Issue>): SignupFieldErrors {
  let errors: SignupFieldErrors = {}
  for (let issue of issues) {
    let key = issue.path?.[0]
    if (key === 'username' || key === 'password' || key === 'password_confirm') {
      errors[key] ??= issue.message
    } else {
      errors.form ??= issue.message
    }
  }
  return errors
}

function SignupPage() {
  return ({ currentUser, values = {}, errors = {} }: SignupPageProps) => (
    <Layout title="Sign up" currentUser={currentUser}>
      <h1>Create your account</h1>
      {errors.form ? <p role="alert">{errors.form}</p> : null}
      <form method="post" action={routes.auth.signup.action.href()}>
        <p>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={values.username ?? ''}
              required
              minLength={2}
              maxLength={20}
              pattern="[A-Za-z0-9]([A-Za-z0-9]|-(?!-))*[A-Za-z0-9]"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellcheck={false}
            />
          </label>
          {errors.username ? <small role="alert">{errors.username}</small> : null}
        </p>
        <p>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          {errors.password ? <small role="alert">{errors.password}</small> : null}
        </p>
        <p>
          <label>
            Confirm password
            <input
              type="password"
              name="password_confirm"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          {errors.password_confirm ? <small role="alert">{errors.password_confirm}</small> : null}
        </p>
        <button type="submit">Sign up</button>
      </form>
    </Layout>
  )
}
