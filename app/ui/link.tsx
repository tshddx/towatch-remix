import { css, link, type RemixNode } from "remix/ui";

import { colors } from "./colors.ts";
import { theme } from "./theme.ts";

export interface LinkProps {
  href: string;
  children?: RemixNode;
}

export function Link() {
  return ({ href, children }: LinkProps) => (
    <a
      mix={[
        link(href),
        css({
          color: colors.light.orange.foreground,
          fontWeight: theme.fontWeight.bold,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            textDecorationColor: colors.light.orange.borderPrimary,
            textDecorationSkipInk: "none",
            textUnderlineOffset: "0.24ch",
          },
        }),
      ]}
    >
      {children}
    </a>
  );
}
