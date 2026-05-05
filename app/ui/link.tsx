import { css, link, type RemixNode } from "remix/ui";

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
          color: theme.colors.text.link,
          fontWeight: theme.fontWeight.bold,
          textDecoration: "underline",
          textDecorationSkipInk: "none",
          textUnderlineOffset: "0.24ch",
        }),
      ]}
    >
      {children}
    </a>
  );
}
