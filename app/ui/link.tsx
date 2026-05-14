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
          color: colors.lightOrangeText,
          fontWeight: theme.fontWeight.bold,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            textDecorationColor: colors.lightOrangeBorder1,
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
