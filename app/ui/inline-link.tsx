import { css, link, type RemixNode } from "remix/ui";

export interface InlineLinkProps {
  href: string;
  children?: RemixNode;
}

/**
 * A bare anchor that inherits surrounding text styling and only adds
 * `text-decoration: underline` on hover. Use inside table cells and other
 * contexts where the link should not visually distinguish itself until hovered.
 */
export function InlineLink() {
  return ({ href, children }: InlineLinkProps) => (
    <a
      mix={[
        link(href),
        css({
          color: "inherit",
          fontWeight: "inherit",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
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
