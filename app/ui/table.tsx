import { css } from "remix/ui";

import { colors } from "./colors.ts";
import { InlineLink } from "./inline-link.tsx";
import { theme } from "./theme.ts";

const COLUMN_GAP_CH = 1;
const COLUMN_GAP = `${COLUMN_GAP_CH}ch`;
const ROW_GAP = 0;
const HEADER_BORDER = `1px solid ${theme.colors.border.subtle}`;

export interface Column<Id extends string = string> {
  id: Id;
  label: string;
  width: number;
}

export type TableCell = string | { href: string; text: string };

export interface TableProps<Id extends string = string> {
  width: number;
  columns: Column<Id>[];
  data: Array<Record<Id, TableCell>>;
}

export function Table<Id extends string>() {
  return ({ width, columns, data }: TableProps<Id>) => {
    let gridWidth = columns.reduce(
      (total, column) => total + column.width,
      Math.max(0, columns.length - 1) * COLUMN_GAP_CH,
    );

    return (
      <div
        mix={css({
          maxWidth: "100%",
          overflowX: "auto",
          width: `${width}ch`,
        })}
      >
        <div
          mix={css({
            columnGap: COLUMN_GAP,
            display: "grid",
            gridTemplateColumns: columns
              .map((column) => `${column.width}ch`)
              .join(" "),
            justifyContent: "start",
            rowGap: ROW_GAP,
            width: `${gridWidth}ch`,
          })}
        >
          <div
            mix={css({
              borderBottom: HEADER_BORDER,
              display: "grid",
              gridColumn: "1 / -1",
              gridTemplateColumns: "subgrid",
            })}
          >
            {columns.map((column) => (
              <TableCellView
                key={column.id}
                color={colors.body.secondary.foreground}
                value={column.label}
                width={column.width}
              />
            ))}
          </div>
          {data.map((row, rowIndex) =>
            columns.map((column) => (
              <TableCellView
                key={`${rowIndex}:${column.id}`}
                value={row[column.id]}
                width={column.width}
              />
            )),
          )}
        </div>
      </div>
    );
  };
}

interface TableCellViewProps {
  color?: string;
  value: TableCell;
  width: number;
}

function TableCellView() {
  return ({ color, value, width }: TableCellViewProps) => (
    <div
      mix={css({
        color,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: `${width}ch`,
      })}
    >
      {typeof value === "string" ? (
        value
      ) : (
        <InlineLink href={value.href}>{value.text}</InlineLink>
      )}
    </div>
  );
}
