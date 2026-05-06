import { css, type RemixNode } from "remix/ui";

import { theme } from "./theme.ts";

const COLUMN_GAP = "1ch";
const ROW_GAP = 0;
const HEADER_BORDER = `1px solid ${theme.colors.border.strong}`;

export interface DataGridProps {
  /**
   * Number of columns. Each column is sized to `auto` so cells size to
   * their content; the grid itself uses `justify-content: start` so the
   * whole thing hugs the left edge instead of stretching.
   */
  columns: number;
  children?: RemixNode;
}

export function DataGrid() {
  return ({ columns, children }: DataGridProps) => (
    <div
      mix={css({
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, auto)`,
        justifyContent: "start",
        columnGap: COLUMN_GAP,
        rowGap: ROW_GAP,
      })}
    >
      {children}
    </div>
  );
}

export interface DataGridHeaderProps {
  children?: RemixNode;
}

/**
 * Wraps header cells in a subgrid that spans every column so the bottom
 * border renders as one continuous line across the column gaps.
 */
export function DataGridHeader() {
  return ({ children }: DataGridHeaderProps) => (
    <div
      mix={css({
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: "subgrid",
        borderBottom: HEADER_BORDER,
      })}
    >
      {children}
    </div>
  );
}
