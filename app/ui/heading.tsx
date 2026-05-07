import { css, type RemixNode } from "remix/ui";

import { theme } from "./theme.ts";

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: RemixNode;
}

export function Heading() {
  return ({ level = 1, children }: HeadingProps) => {
    let Tag = `h${level}` as const;
    return (
      <Tag
        mix={css({
          margin: 0,
          fontSize: "inherit",
          fontWeight: theme.fontWeight.bold,
          lineHeight: theme.lineHeight.normal,
          textTransform: "uppercase",
          color: level === 2 ? theme.colors.action.secondary.foreground : theme.colors.text.primary,
        })}
      >
        {children}
      </Tag>
    );
  };
}
