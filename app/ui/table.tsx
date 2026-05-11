import { css } from "remix/ui";

import { colors } from "./colors.ts";
import { InlineLink } from "./inline-link.tsx";
import { computeTableColumnWidths } from "./table-widths.ts";

const ROW_GAP = 0;
const HEADER_BORDER = `1px solid ${colors.border.subtle}`;

export interface Column<Id extends string = string> {
  align?: "left" | "right";
  id: Id;
  label: string;
  width: number;
}

export type TableCell = string | { href: string; text: string };

export interface TableProps<Id extends string = string> {
  columns: Column<Id>[];
  data: Array<Record<Id, TableCell>>;
}

export function Table<Id extends string>() {
  return ({ columns, data }: TableProps<Id>) => {
    let columnWidths = getColumnWidths(columns, data);
    let columnAlignments = columns.map((column) => column.align ?? "left");

    return (
      <div
        mix={css({
          maxWidth: "100%",
          overflowX: "auto",
        })}
      >
        <div
          mix={css({
            display: "grid",
            gridTemplateColumns: `repeat(${columns.length}, auto)`,
            justifyContent: "start",
            rowGap: ROW_GAP,
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
                align={columnAlignments[columnIndex]}
                color={colors.body.secondary.foreground}
                value={column.label}
                maxLength={columnWidths[columnIndex]}
              />
            ))}
          </div>
          {data.map((row, rowIndex) =>
            columns.map((column, columnIndex) => (
              <TableCellView
                key={`${rowIndex}:${column.id}`}
                align={columnAlignments[columnIndex]}
                isFirstColumn={columnIndex === 0}
                isLastColumn={columnIndex === columns.length - 1}
                maxLength={columnWidths[columnIndex]}
                value={row[column.id]}
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
  align?: "left" | "right";
  color?: string;
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
  maxLength: number;
  value: TableCell;
}

function TableCellView() {
  return ({
    align = "left",
    color,
    isFirstColumn = true,
    isLastColumn = true,
    maxLength,
    value,
  }: TableCellViewProps) => {
    let text = getCellText(value);
    let truncated = truncateText(text, maxLength);
    let fillCount = getFillCount(maxLength, truncated.text.length);
    let leadingFillCount = align === "right" && !isFirstColumn ? fillCount : 0;
    let leadingSpaceCount =
      align === "right" && leadingFillCount === 0
        ? getPaddingCount(maxLength, truncated.text.length)
        : 0;
    let trailingFillCount = !isLastColumn ? fillCount : 0;

    return (
      <div mix={css({ whiteSpace: "nowrap" })}>
        {leadingFillCount > 0 ? <PeriodFill count={leadingFillCount} /> : null}
        {leadingSpaceCount > 0 ? <SpaceFill count={leadingSpaceCount} /> : null}
        <TableCellText
          color={color}
          fullText={text}
          text={truncated.text}
          value={value}
        />
        {trailingFillCount > 0 ? (
          <PeriodFill count={trailingFillCount} />
        ) : null}
      </div>
    );
  };
}

interface TableCellTextProps {
  color?: string;
  fullText: string;
  text: string;
  value: TableCell;
}

function TableCellText() {
  return ({ color, fullText, text, value }: TableCellTextProps) => {
    let content =
      typeof value === "string" ? (
        text
      ) : (
        <InlineLink href={value.href}>{text}</InlineLink>
      );
    if (text === fullText) return <span mix={css({ color })}>{content}</span>;

    return (
      <span aria-label={fullText} mix={css({ color })}>
        {content}
      </span>
    );
  };
}

function PeriodFill() {
  return ({ count }: { count: number }) => (
    <span
      mix={css({
        color: colors.body.tertiary.foreground,
        flex: "none",
      })}
    >
      {".".repeat(count)}
    </span>
  );
}

function SpaceFill() {
  return ({ count }: { count: number }) => (
    <span>{"\u00A0".repeat(count)}</span>
  );
}

export function truncateText(
  text: string,
  maxLength: number,
): { text: string } {
  if (text.length <= maxLength) return { text };
  if (maxLength <= 0) return { text: "" };
  if (maxLength === 1) return { text: "\u2026" };

  let prefix = text.slice(0, maxLength - 1);
  if (/\s$/.test(prefix)) prefix = prefix.slice(0, -1);

  return { text: `${prefix}\u2026` };
}

function getFillCount(maxLength: number, visibleTextWidth: number): number {
  if (maxLength <= 0) return 0;
  return Math.max(1, maxLength - visibleTextWidth + 1);
}

function getPaddingCount(maxLength: number, visibleTextWidth: number): number {
  if (maxLength <= 0) return 0;
  return Math.max(0, maxLength - visibleTextWidth);
}
