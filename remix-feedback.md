# Remix Feedback

Running notes on pain points and general feedback as we build with Remix 3. Captures friction worth surfacing later, whether it's about the framework itself or the workflow around it.

## Agents trying to verify by booting the dev server

Claude Code repeatedly started `npm run dev` / `npm run start` and curled the local server to verify route and form changes. This duplicates any server the user already has running, pollutes on-disk state (SQLite db, session files, generated `.env.development.local`), and burns time that `npm run typecheck` (and tests, eventually) would cover for the same changes.

Addressed in `AGENTS.md` with a `## Verifying Changes` section telling agents to prefer typecheck/tests and defer runtime verification to the user.
