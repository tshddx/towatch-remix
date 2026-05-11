import { Database } from "remix/data-table";
import type { BuildAction } from "remix/fetch-router";
import { Session } from "remix/session";
import { css } from "remix/ui";

import type { AppContext } from "../router.ts";
import { routes } from "../routes.ts";
import { Button, type ButtonTone } from "../ui/button.tsx";
import { Form } from "../ui/form.tsx";
import { Heading } from "../ui/heading.tsx";
import { Layout } from "../ui/layout.tsx";
import { Link } from "../ui/link.tsx";
import { TextField } from "../ui/text-field.tsx";
import { theme } from "../ui/theme.ts";
import { loadCurrentUser, type CurrentUser } from "../utils/current-user.ts";
import { render } from "../utils/render.tsx";

interface DesignGuidePageProps {
  currentUser: CurrentUser | null;
}

export const designGuide: BuildAction<
  "GET",
  typeof routes.designGuide,
  AppContext
> = {
  async handler({ get, request }) {
    let currentUser = await loadCurrentUser(get(Database), get(Session));
    return render(<DesignGuidePage currentUser={currentUser} />, request);
  },
};

interface ColorToken {
  label: string;
  value: string;
}

const surfaceTokens: ColorToken[] = [
  { label: "surface.lvl0", value: theme.surface.lvl0 },
  { label: "surface.lvl1", value: theme.surface.lvl1 },
  { label: "surface.lvl2", value: theme.surface.lvl2 },
  { label: "surface.lvl3", value: theme.surface.lvl3 },
  { label: "surface.lvl4", value: theme.surface.lvl4 },
];

const textTokens: ColorToken[] = [
  { label: "colors.text.primary", value: theme.colors.text.primary },
  { label: "colors.text.secondary", value: theme.colors.text.secondary },
  { label: "colors.text.muted", value: theme.colors.text.muted },
  { label: "colors.text.link", value: theme.colors.text.link },
];

const borderTokens: ColorToken[] = [
  { label: "colors.border.subtle", value: theme.colors.border.subtle },
  { label: "colors.border.default", value: theme.colors.border.default },
  { label: "colors.border.strong", value: theme.colors.border.strong },
];

const miscTokens: ColorToken[] = [
  { label: "colors.focus.ring", value: theme.colors.focus.ring },
  { label: "colors.overlay.scrim", value: theme.colors.overlay.scrim },
];

interface ActionTone {
  name: ButtonTone;
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  foreground: string;
}

const actionTones: ActionTone[] = [
  {
    name: "primary",
    background: theme.colors.action.primary.background,
    backgroundHover: theme.colors.action.primary.backgroundHover,
    backgroundActive: theme.colors.action.primary.backgroundActive,
    foreground: theme.colors.action.primary.foreground,
  },
  {
    name: "secondary",
    background: theme.colors.action.secondary.background,
    backgroundHover: theme.colors.action.secondary.backgroundHover,
    backgroundActive: theme.colors.action.secondary.backgroundActive,
    foreground: theme.colors.action.secondary.foreground,
  },
  {
    name: "danger",
    background: theme.colors.action.danger.background,
    backgroundHover: theme.colors.action.danger.backgroundHover,
    backgroundActive: theme.colors.action.danger.backgroundActive,
    foreground: theme.colors.action.danger.foreground,
  },
];

function DesignGuidePage() {
  return ({ currentUser }: DesignGuidePageProps) => (
    <Layout title="Design Guide" currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "2lh" })}>
        <section mix={sectionStyle}>
          <Heading>Design Guide</Heading>
          <p mix={css({ margin: 0 })}>
            Every color token in the theme and every shared component currently
            in use.
          </p>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Surfaces</Heading>
          <SwatchGrid tokens={surfaceTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Text</Heading>
          <SwatchGrid tokens={textTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Borders</Heading>
          <SwatchGrid tokens={borderTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Focus &amp; Overlay</Heading>
          <SwatchGrid tokens={miscTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Actions</Heading>
          <div
            mix={css({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(32ch, 1fr))",
              gap: "1lh 2ch",
            })}
          >
            {actionTones.map((tone) => (
              <ActionToneCard key={tone.name} tone={tone} />
            ))}
          </div>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Headings</Heading>
          <p mix={css({ margin: 0 })}>
            <code>Heading</code> levels 1 and 2 use the large page-heading
            scale, while level 3 is the smaller bold heading used by compact
            labels like the sidebar brand.
          </p>
          <div
            mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}
          >
            <Heading level={1}>Heading Level 1</Heading>
            <Heading level={2}>Heading Level 2</Heading>
            <Heading level={3}>Heading Level 3</Heading>
            <Heading level={4}>Heading Level 4</Heading>
            <Heading level={5}>Heading Level 5</Heading>
          </div>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Links</Heading>
          <p mix={css({ margin: 0 })}>
            A paragraph with a{" "}
            <Link href={routes.home.href()}>link to home</Link> in the middle of
            it, plus a{" "}
            <Link href={routes.designGuide.href()}>link back to this page</Link>
            .
          </p>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Buttons</Heading>
          <div
            mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}
          >
            {actionTones.map((tone) => (
              <div
                key={tone.name}
                mix={css({
                  display: "flex",
                  gap: "1ch",
                  alignItems: "flex-start",
                })}
              >
                <Button tone={tone.name}>{tone.name} md</Button>
                <Button tone={tone.name} size="lg">
                  {tone.name} lg
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Form</Heading>
          <p mix={css({ margin: 0 })}>
            <code>Form</code> arranges its children in a flex column with a 1lh
            gap. Each <code>TextField</code> reserves a 1lh row under the input
            for an error message, so adding or removing an error doesn't shift
            the form's layout.
          </p>
          <Form>
            <TextField label="Plain field" name="example_plain" type="text" />
            <TextField
              label="Field with error"
              name="example_error"
              type="text"
              value="not-a-valid-value"
              error="This is the error message."
            />
            <Button type="submit" size="lg">
              Submit
            </Button>
          </Form>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Validation Alert</Heading>
          <p mix={css({ margin: 0 })}>
            <code>TextField</code> uses this style for its inline errors.
            Form-level alerts (e.g. a login that failed because of a bad
            password) use the same style.
          </p>
          <p role="alert" mix={css({ margin: 0 })}>
            This is what a validation error looks like.
          </p>
        </section>
      </div>
    </Layout>
  );
}

const sectionStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "1lh",
});

interface SwatchGridProps {
  tokens: ColorToken[];
}

function SwatchGrid() {
  return ({ tokens }: SwatchGridProps) => (
    <div
      mix={css({
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(28ch, 1fr))",
        gap: "1lh 2ch",
      })}
    >
      {tokens.map((token) => (
        <Swatch key={token.label} label={token.label} value={token.value} />
      ))}
    </div>
  );
}

interface SwatchProps {
  label: string;
  value: string;
}

function Swatch() {
  return ({ label, value }: SwatchProps) => (
    <div mix={css({ display: "flex", gap: "1ch", alignItems: "flex-start" })}>
      <div
        mix={css({
          flex: "0 0 auto",
          width: "3ch",
          height: "3lh",
          background: value,
          border: `1px solid ${theme.colors.border.default}`,
        })}
      />
      <div mix={css({ display: "flex", flexDirection: "column", minWidth: 0 })}>
        <code mix={css({ fontFamily: theme.fontFamily.mono })}>{label}</code>
        <code
          mix={css({
            fontFamily: theme.fontFamily.mono,
            color: theme.colors.text.muted,
            wordBreak: "break-all",
          })}
        >
          {value}
        </code>
      </div>
    </div>
  );
}

interface ActionToneCardProps {
  tone: ActionTone;
}

function ActionToneCard() {
  return ({ tone }: ActionToneCardProps) => (
    <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
      <div
        mix={css({
          padding: "1lh 1ch",
          background: tone.background,
          color: tone.foreground,
          border: `1px solid ${theme.colors.border.default}`,
        })}
      >
        <code mix={css({ fontFamily: theme.fontFamily.mono })}>
          action.{tone.name}
        </code>
      </div>
      <div mix={css({ display: "flex", gap: "1ch", alignItems: "flex-start" })}>
        <ActionStateChip label="hover" color={tone.backgroundHover} />
        <ActionStateChip label="active" color={tone.backgroundActive} />
      </div>
    </div>
  );
}

interface ActionStateChipProps {
  label: string;
  color: string;
}

function ActionStateChip() {
  return ({ label, color }: ActionStateChipProps) => (
    <div mix={css({ display: "flex", gap: "1ch", alignItems: "center" })}>
      <div
        mix={css({
          flex: "0 0 auto",
          width: "2ch",
          height: "1lh",
          background: color,
          border: `1px solid ${theme.colors.border.default}`,
        })}
      />
      <code
        mix={css({
          fontFamily: theme.fontFamily.mono,
          color: theme.colors.text.muted,
        })}
      >
        {label}
      </code>
    </div>
  );
}
