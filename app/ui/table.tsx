import { css } from "remix/ui";

import { colors } from "./colors.ts";
import { InlineLink } from "./inline-link.tsx";
import { computeTableColumnWidths } from "./table-widths.ts";
import { theme } from "./theme.ts";

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
    let gridColumnWidths = columnWidths.map(
      (columnWidth, index) => columnWidth + (index < columns.length - 1 ? 1 : 0),
    );
    let gridWidth = gridColumnWidths.reduce(
      (total, columnWidth) => total + columnWidth,
      0,
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
            display: "grid",
            gridTemplateColumns: gridColumnWidths
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
                valueWidth={columnWidths[columnIndex]}
                width={gridColumnWidths[columnIndex]}
              />
            ))}
          </div>
          {data.map((row, rowIndex) =>
            columns.map((column, columnIndex) => (
              <TableCellView
                key={`${rowIndex}:${column.id}`}
                fill={columnIndex < columns.length - 1}
                value={row[column.id]}
                valueWidth={columnWidths[columnIndex]}
                width={gridColumnWidths[columnIndex]}
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
  fill?: boolean;
  value: TableCell;
  valueWidth: number;
  width: number;
}

function TableCellView() {
  return ({
    color,
    fill = false,
    value,
    valueWidth,
    width,
  }: TableCellViewProps) => {
    let fillCount = fill ? getFillCount(width, valueWidth, getCellText(value)) : 0;

    return (
      <div
        mix={css({
          display: "flex",
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: `${width}ch`,
        })}
      >
        <span
          mix={css({
            color,
            display: "inline-block",
            flex: "0 0 auto",
            maxWidth: `${valueWidth}ch`,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          })}
        >
          {typeof value === "string" ? (
            value
          ) : (
            <InlineLink href={value.href}>{value.text}</InlineLink>
          )}
        </span>
        {fillCount > 0 ? (
          <span
            mix={css({
              color: theme.colors.text.muted,
              flex: "none",
            })}
          >
            {".".repeat(fillCount)}
          </span>
        ) : null}
      </div>
    );
  };
}

function getFillCount(width: number, valueWidth: number, text: string): number {
  if (width <= 0) return 0;
  return Math.max(1, width - Math.min(text.length, valueWidth));
}
