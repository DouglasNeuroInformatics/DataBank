import { DateTime } from 'luxon';

/**
 * Format a Date as an ISO8601 calendar date (`YYYY-MM-DD`).
 *
 * Used for user-facing display where time-of-day is not relevant. Forces UTC
 * to avoid off-by-one drift when the stored instant falls near midnight in
 * the server's local zone.
 */
export const formatISODate = (date: Date): string => {
  const dt = DateTime.fromJSDate(date, { zone: 'utc' });
  if (!dt.isValid) {
    throw new TypeError(`Invalid Date: ${String(date)}`);
  }
  return dt.toISODate();
};

/**
 * Format a Date as a full ISO8601 datetime with UTC offset (`YYYY-MM-DDTHH:mm:ss.sssZ`).
 *
 * Use this at storage/transport boundaries (API responses, CSV exports) so that
 * the full precision of the instant is preserved across systems.
 */
export const formatISODateTime = (date: Date): string => {
  const dt = DateTime.fromJSDate(date, { zone: 'utc' });
  if (!dt.isValid) {
    throw new TypeError(`Invalid Date: ${String(date)}`);
  }
  return dt.toISO();
};

/**
 * Parse an ISO8601 string (date or datetime) into a Date.
 *
 * Throws if the input is not a valid ISO8601 string. Forces UTC so the returned
 * Date represents the same instant regardless of the host's local timezone.
 */
export const parseISODate = (input: string): Date => {
  const dt = DateTime.fromISO(input, { zone: 'utc' });
  if (!dt.isValid) {
    throw new TypeError(`Invalid ISO8601 date string: ${input}`);
  }
  return dt.toJSDate();
};
