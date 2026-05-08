import { css } from "remix/ui";

import { colors } from "./colors.ts";
import { InlineLink } from "./inline-link.tsx";
import { computeTableColumnWidths } from "./table-widths.ts";
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
    let columnWidths = getColumnWidths(columns, data);
    let gridWidth = columnWidths.reduce(
      (total, columnWidth) => total + columnWidth,
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
            gridTemplateColumns: columnWidths
              .map((columnWidth) => `${columnWidth}ch`)
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
            {columns.map((column, columnIndex) => (
              <TableCellView
                key={column.id}
                color={colors.body.secondary.foreground}
                value={column.label}
                width={columnWidths[columnIndex]}
              />
            ))}
          </div>
          {data.map((row, rowIndex) =>
            columns.map((column, columnIndex) => (
              <TableCellView
                key={`${rowIndex}:${column.id}`}
                value={row[column.id]}
                width={columnWidths[columnIndex]}
              />
            )),
          )}
        </div>
      </div>
    );
  };
}

function getColumnWidths<Id extends string>(
  columns: Column<Id>[],
  data: Array<Record<Id, TableCell>>,
): number[] {
  return computeTableColumnWidths(
    columns.map((column) => {
      let widestValue = column.label.length;
      for (let row of data) {
        widestValue = Math.max(widestValue, getCellText(row[column.id]).length);
      }

      return { declaredWidth: column.width, widestValue };
    }),
  ).map((column) => column.computedWidth);
}

function getCellText(value: TableCell): string {
  return typeof value === "string" ? value : value.text;
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
