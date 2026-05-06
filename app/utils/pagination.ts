/** Number of rows per page in list views. */
export const PAGE_SIZE = 20;

export interface ParsedPage {
  /** 1-based page number, clamped to >= 1. */
  page: number;
  /**
   * When non-null, the request used a `?page=` value that should be
   * normalized away (e.g. `?page=1`, `?page=0`, `?page=-1`,
   * `?page=foo`). Callers should redirect the request to the URL with
   * `?page` removed before rendering.
   */
  shouldStripPage: boolean;
}

/**
 * Parse the `page` query string for a list route.
 *
 * - Missing → `{ page: 1, shouldStripPage: false }`.
 * - `?page=1` → `{ page: 1, shouldStripPage: true }` so the controller can
 *   redirect to the bare path.
 * - `?page=N` (N >= 2) → `{ page: N, shouldStripPage: false }`.
 * - Anything else (negative, zero, non-numeric) → `{ page: 1, shouldStripPage: true }`.
 */
export function parsePageParam(url: URL): ParsedPage {
  let raw = url.searchParams.get("page");
  if (raw === null) return { page: 1, shouldStripPage: false };

  let page = Number(raw);
  if (!Number.isInteger(page) || page < 1) {
    return { page: 1, shouldStripPage: true };
  }
  if (page === 1) {
    return { page: 1, shouldStripPage: true };
  }
  return { page, shouldStripPage: false };
}

/**
 * Build a URL for a given page number on a list route. Page 1 returns
 * the bare base path with no query string; other pages append `?page=N`.
 */
export function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}
