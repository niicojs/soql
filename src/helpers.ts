import type { RawValue, LikeValue } from './types';

/**
 * Creates a raw (unescaped) value for use in SOQL queries.
 * Use with caution - only for trusted field names, operators, etc.
 *
 * @example
 * const field = 'Name';
 * soql`SELECT ${raw(field)} FROM Account`
 * // → SELECT Name FROM Account
 */
export const raw = (value: string): RawValue => ({
  __raw: true,
  value,
});

/**
 * Creates a LIKE pattern value with special escaping.
 * Escapes %, _, and \ characters in the value while preserving
 * wildcards you add yourself.
 *
 * @example
 * const search = "100%";
 * soql`SELECT Id FROM Account WHERE Name LIKE ${like('%' + search + '%')}`
 * // → SELECT Id FROM Account WHERE Name LIKE '%100\%%'
 */
export const like = (value: string): LikeValue => ({
  __like: true,
  value,
});

/**
 * Type guard for RawValue.
 */
export const isRawValue = (val: unknown): val is RawValue =>
  typeof val === 'object' && val !== null && '__raw' in val && (val as RawValue).__raw === true;

/**
 * Type guard for LikeValue.
 */
export const isLikeValue = (val: unknown): val is LikeValue =>
  typeof val === 'object' && val !== null && '__like' in val && (val as LikeValue).__like === true;
