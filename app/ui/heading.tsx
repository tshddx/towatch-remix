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
    let isLargeHeading = level === 1 || level === 2;
    return (
      <Tag
        mix={css({
          margin: 0,
          fontSize: isLargeHeading ? theme.fontSize.lg : theme.fontSize.md,
          fontWeight: isLargeHeading
            ? theme.fontWeight.normal
            : theme.fontWeight.bold,
          lineHeight: isLargeHeading
            ? theme.lineHeight.relaxed
            : theme.lineHeight.normal,
          textTransform: "uppercase",
          color:
            level === 2
              ? colors.light.teal.foreground
              : theme.colors.text.primary,
        })}
      >
        {children}
      </Tag>
    );
  };
}
