import { css } from "remix/ui";

import { pageHref } from "../utils/pagination.ts";
import { Link } from "./link.tsx";
import { colors } from "./colors.ts";

export interface PaginationControlsProps {
  basePath: string;
  page: number;
  hasNextPage: boolean;
}

/**
 * Renders Previous/Next controls for a paginated list. Page 1 links use the
 * bare `basePath`; later pages use `?page=N`. Unavailable directions render
 * as muted text instead of links.
 */
export function PaginationControls() {
  return ({ basePath, page, hasNextPage }: PaginationControlsProps) => {
    let hasPrevPage = page > 1;
    return (
      <nav mix={css({ display: "flex", gap: "2ch" })}>
        {hasPrevPage ? (
          <Link href={pageHref(basePath, page - 1)}>Previous</Link>
        ) : (
          <span mix={css({ color: colors.bodyText3 })}>Previous</span>
        )}
        {hasNextPage ? (
          <Link href={pageHref(basePath, page + 1)}>Next</Link>
        ) : (
          <span mix={css({ color: colors.bodyText3 })}>Next</span>
        )}
      </nav>
    );
  };
}
