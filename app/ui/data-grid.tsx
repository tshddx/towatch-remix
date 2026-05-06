import { css, type RemixNode } from "remix/ui";

import { theme } from "./theme.ts";

const COLUMN_GAP = "1ch";
const ROW_GAP = 0;
const HEADER_BORDER = `1px solid ${theme.colors.border.strong}`;

const TRUNCATE_CELL = {
  maxWidth: "30ch",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

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
        // Truncate every direct-child cell with an ellipsis when its
        // contents would exceed 30ch.
        "& > div": TRUNCATE_CELL,
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
        // The header wrapper itself is a layout container that spans the
        // whole row, so undo the parent grid's per-cell truncation here
        // and reapply it to the actual header cells nested inside.
        maxWidth: "none",
        overflow: "visible",
        textOverflow: "clip",
        whiteSpace: "normal",
        "& > div": TRUNCATE_CELL,
      })}
    >
      {children}
    </div>
  );
}
