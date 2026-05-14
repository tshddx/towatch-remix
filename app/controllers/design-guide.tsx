import { Database } from "remix/data-table";
import type { BuildAction } from "remix/fetch-router";
import { Session } from "remix/session";
import { css } from "remix/ui";

import type { AppContext } from "../router.ts";
import { routes } from "../routes.ts";
import { Button, type ButtonColor } from "../ui/button.tsx";
import { Form } from "../ui/form.tsx";
import { Heading } from "../ui/heading.tsx";
import { Layout } from "../ui/layout.tsx";
import { Link } from "../ui/link.tsx";
import { TextField } from "../ui/text-field.tsx";
import { colors } from "../ui/colors.ts";
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

const bodyTokens: ColorToken[] = [
  { label: "bodyText1", value: colors.bodyText1 },
  { label: "bodyText2", value: colors.bodyText2 },
  { label: "bodyText3", value: colors.bodyText3 },
  { label: "bodyBg1", value: colors.bodyBg1 },
  { label: "bodyBg2", value: colors.bodyBg2 },
];

const borderTokens: ColorToken[] = [
  { label: "border1", value: colors.border1 },
  { label: "border2", value: colors.border2 },
  { label: "border3", value: colors.border3 },
];

const miscTokens: ColorToken[] = [
  { label: "focusRing", value: colors.focusRing },
  { label: "overlayScrim", value: colors.overlayScrim },
];

const solidOrangeTokens: ColorToken[] = [
  { label: "solidOrangeBg1", value: colors.solidOrangeBg1 },
  { label: "solidOrangeBg2", value: colors.solidOrangeBg2 },
  { label: "solidOrangeText", value: colors.solidOrangeText },
];

const solidTealTokens: ColorToken[] = [
  { label: "solidTealBg1", value: colors.solidTealBg1 },
  { label: "solidTealBg2", value: colors.solidTealBg2 },
  { label: "solidTealText", value: colors.solidTealText },
];

const lightTealTokens: ColorToken[] = [
  { label: "lightTealBg1", value: colors.lightTealBg1 },
  { label: "lightTealBg2", value: colors.lightTealBg2 },
  { label: "lightTealText", value: colors.lightTealText },
];

const lightOrangeTokens: ColorToken[] = [
  { label: "lightOrangeBg1", value: colors.lightOrangeBg1 },
  { label: "lightOrangeBg2", value: colors.lightOrangeBg2 },
  { label: "lightOrangeText", value: colors.lightOrangeText },
  { label: "lightOrangeBorder1", value: colors.lightOrangeBorder1 },
  { label: "lightOrangeBorder2", value: colors.lightOrangeBorder2 },
];

const lightRedTokens: ColorToken[] = [
  { label: "lightRedBg1", value: colors.lightRedBg1 },
  { label: "lightRedBg2", value: colors.lightRedBg2 },
  { label: "lightRedText", value: colors.lightRedText },
];

const buttonColors: ButtonColor[] = [
  "solidOrange",
  "solidTeal",
  "lightTeal",
  "lightOrange",
  "lightRed",
];

function DesignGuidePage() {
  return ({ currentUser }: DesignGuidePageProps) => (
    <Layout title="Design Guide" currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "2lh" })}>
        <section mix={sectionStyle}>
          <Heading>Design Guide</Heading>
          <p mix={css({ margin: 0 })}>
            Every app color token currently in use, plus shared component
            examples.
          </p>
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Body</Heading>
          <SwatchGrid tokens={bodyTokens} />
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
          <Heading level={2}>Solid Orange</Heading>
          <SwatchGrid tokens={solidOrangeTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Solid Teal</Heading>
          <SwatchGrid tokens={solidTealTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Light Teal</Heading>
          <SwatchGrid tokens={lightTealTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Light Orange</Heading>
          <SwatchGrid tokens={lightOrangeTokens} />
        </section>

        <section mix={sectionStyle}>
          <Heading level={2}>Light Red</Heading>
          <SwatchGrid tokens={lightRedTokens} />
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
            {buttonColors.map((color) => (
              <div
                key={color}
                mix={css({
                  display: "flex",
                  gap: "1ch",
                  alignItems: "flex-start",
                })}
              >
                <Button color={color}>{color} md</Button>
                <Button color={color} size="lg">
                  {color} lg
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
          border: `1px solid ${colors.border2}`,
        })}
      />
      <div mix={css({ display: "flex", flexDirection: "column", minWidth: 0 })}>
        <code mix={css({ fontFamily: theme.fontFamily.mono })}>{label}</code>
        <code
          mix={css({
            fontFamily: theme.fontFamily.mono,
            color: colors.bodyText2,
            wordBreak: "break-all",
          })}
        >
          {value}
        </code>
      </div>
    </div>
  );
}
