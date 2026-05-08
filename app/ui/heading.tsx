import { css, type RemixNode } from "remix/ui";

import { colors } from "./colors.ts";
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
          fontSize: level === 2 ? theme.fontSize.lg : "inherit",
          fontWeight:
            level === 2 ? theme.fontWeight.normal : theme.fontWeight.bold,
          lineHeight:
            level === 2 ? theme.lineHeight.relaxed : theme.lineHeight.normal,
          textTransform: "uppercase",
          color:
            level === 2
              ? colors.light.teal.foreground
              : colors.body.primary.foreground,
        })}
      >
        {children}
      </Tag>
    );
  };
}
