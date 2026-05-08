import { css } from "remix/ui";

import { pageHref } from "../utils/pagination.ts";
import { Link } from "./link.tsx";

export interface PaginationControlsProps {
  basePath: string;
  page: number;
  hasNextPage: boolean;
}

/**
 * Renders Previous/Next links for a paginated list. Page 1 links use the
 * bare `basePath`; later pages use `?page=N`. If neither direction is
 * available the component renders nothing.
 */
export function PaginationControls() {
  return ({ basePath, page, hasNextPage }: PaginationControlsProps) => {
    let hasPrevPage = page > 1;
    if (!hasPrevPage && !hasNextPage) return null;
    return (
      <nav mix={css({ display: "flex", gap: "2ch" })}>
        {hasPrevPage ? (
          <Link href={pageHref(basePath, page - 1)}>Previous</Link>
        ) : null}
        {hasNextPage ? (
          <Link href={pageHref(basePath, page + 1)}>Next</Link>
        ) : null}
      </nav>
    );
  };
}
