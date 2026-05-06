/**
 * Format an epoch-ms timestamp as a calendar date in `YYYY-MM-DD` form,
 * interpreting the value at UTC. Returns `null` when the input is null.
 *
 * Movie release dates and viewing dates are stored as midnight-UTC
 * epoch ms (see the seed script), so we read them back at UTC to avoid
 * the timezone-shifting that would otherwise nudge a date by one day in
 * the user's locale.
 */
export function formatDate(ms: number | null): string | null {
  if (ms === null) return null;
  let date = new Date(ms);
  let yyyy = date.getUTCFullYear().toString().padStart(4, "0");
  let mm = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  let dd = date.getUTCDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Return the four-digit year for an epoch-ms timestamp at UTC, or `null`
 * for null input.
 */
export function formatYear(ms: number | null): string | null {
  if (ms === null) return null;
  return new Date(ms).getUTCFullYear().toString();
}
