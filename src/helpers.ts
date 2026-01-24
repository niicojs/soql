import type { RawValue, LikeValue, DateValue, DateLiteral } from './types';
import { RAW_SYMBOL, LIKE_SYMBOL, DATE_SYMBOL } from './types';

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
  [RAW_SYMBOL]: true,
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
  [LIKE_SYMBOL]: true,
  value,
});

/**
 * Creates a date-only value (without time component).
 * Forces formatting as YYYY-MM-DD instead of datetime.
 *
 * @example
 * const d = new Date('2024-03-15T14:30:00Z');
 * soql`SELECT Id FROM Account WHERE CreatedDate = ${date(d)}`
 * // → SELECT Id FROM Account WHERE CreatedDate = 2024-03-15
 *
 * @throws {Error} If the provided Date is invalid
 */
export const date = (value: Date): DateValue => {
  if (isNaN(value.getTime())) {
    throw new Error('Invalid Date object');
  }
  return {
    [DATE_SYMBOL]: true,
    value,
  };
};

/**
 * Creates a SOQL date literal value.
 * Date literals are special keywords like TODAY, YESTERDAY, LAST_N_DAYS:n, etc.
 *
 * @example
 * soql`SELECT Id FROM Account WHERE CreatedDate > ${literal('YESTERDAY')}`
 * // → SELECT Id FROM Account WHERE CreatedDate > YESTERDAY
 *
 * @example
 * soql`SELECT Id FROM Account WHERE CreatedDate > ${literal('LAST_N_DAYS:30')}`
 * // → SELECT Id FROM Account WHERE CreatedDate > LAST_N_DAYS:30
 */
export const literal = (value: DateLiteral): RawValue => raw(value);

/**
 * Type guard for RawValue.
 */
export const isRawValue = (val: unknown): val is RawValue =>
  typeof val === 'object' && val !== null && RAW_SYMBOL in val && (val as RawValue)[RAW_SYMBOL] === true;

/**
 * Type guard for LikeValue.
 */
export const isLikeValue = (val: unknown): val is LikeValue =>
  typeof val === 'object' && val !== null && LIKE_SYMBOL in val && (val as LikeValue)[LIKE_SYMBOL] === true;

/**
 * Type guard for DateValue.
 */
export const isDateValue = (val: unknown): val is DateValue =>
  typeof val === 'object' && val !== null && DATE_SYMBOL in val && (val as DateValue)[DATE_SYMBOL] === true;
