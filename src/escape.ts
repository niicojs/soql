import type { SoqlValue, RawValue } from './types';
import { isRawValue, isLikeValue, isDateValue, raw } from './helpers';

/**
 * Escapes a string value for use in SOQL queries.
 * Handles single quotes, backslashes, and control characters.
 *
 * @param val - The string to escape
 * @returns The escaped string (without surrounding quotes)
 */
export const escapeString = (val: string): string => {
  return val
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r') // Escape carriage returns
    .replace(/\t/g, '\\t') // Escape tabs
    .replace(/\0/g, '\\0'); // Escape null bytes
};

/**
 * Escapes a string for use in LIKE patterns.
 * In addition to normal string escaping, also escapes LIKE wildcards.
 *
 * @param val - The string to escape for LIKE pattern
 * @returns The escaped string (without surrounding quotes)
 */
export const escapeLike = (val: string): string => {
  return val
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/%/g, '\\%') // Escape percent (LIKE wildcard)
    .replace(/_/g, '\\_') // Escape underscore (LIKE wildcard)
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r') // Escape carriage returns
    .replace(/\t/g, '\\t') // Escape tabs
    .replace(/\0/g, '\\0'); // Escape null bytes
};

/**
 * Formats a Date object as a SOQL date literal (YYYY-MM-DD).
 *
 * @param date - The Date object to format
 * @returns The formatted date string
 */
export const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a Date object as a SOQL datetime literal (YYYY-MM-DDThh:mm:ssZ).
 *
 * @param date - The Date object to format
 * @returns The formatted datetime string
 */
export const formatDateTime = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Escapes an array of values for use in an IN clause.
 * Returns the values as a parenthesized, comma-separated list.
 *
 * @param arr - The array of values to escape
 * @returns The escaped array as a parenthesized list
 * @throws {Error} If the array is empty (empty IN clauses are not valid in SOQL)
 */
export const escapeArray = (arr: SoqlValue[]): string => {
  if (arr.length === 0) {
    throw new Error(
      'Empty arrays are not allowed in SOQL IN clauses. Use a conditional to skip the query or provide at least one value.',
    );
  }
  const escaped = arr.map((item) => escapeValue(item, true));
  return `(${escaped.join(', ')})`;
};

/**
 * Escapes a value based on its type for safe use in SOQL queries.
 *
 * @param val - The value to escape
 * @param wrapStrings - Whether to wrap string values in quotes (default: true)
 * @returns The escaped value as a string
 * @throws {Error} If the value is an invalid number (Infinity, NaN)
 * @throws {Error} If the value is an invalid Date
 * @throws {Error} If the value is an empty array
 * @throws {Error} If the value type is not supported
 */
export const escapeValue = (val: SoqlValue, wrapStrings: boolean = true): string => {
  // Handle null and undefined
  if (val === null || val === undefined) {
    return 'null';
  }

  // Handle raw values (no escaping)
  if (isRawValue(val)) {
    return val.value;
  }

  // Handle LIKE values (special escaping)
  if (isLikeValue(val)) {
    const escaped = escapeLike(val.value);
    return wrapStrings ? `'${escaped}'` : escaped;
  }

  // Handle DateValue (date-only format)
  if (isDateValue(val)) {
    return formatDate(val.value);
  }

  // Handle arrays (IN clause)
  if (Array.isArray(val)) {
    return escapeArray(val);
  }

  // Handle booleans
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }

  // Handle numbers
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      throw new Error(`Invalid SOQL number value: ${val}`);
    }
    return String(val);
  }

  // Handle dates
  if (val instanceof Date) {
    if (isNaN(val.getTime())) {
      throw new Error('Invalid Date object');
    }
    // Use datetime format by default (more precise)
    return formatDateTime(val);
  }

  // Handle strings
  if (typeof val === 'string') {
    const escaped = escapeString(val);
    return wrapStrings ? `'${escaped}'` : escaped;
  }

  // Fallback - shouldn't reach here with proper typing
  throw new Error(`Unsupported SOQL value type: ${typeof val}`);
};

/**
 * Joins multiple SOQL values with a separator.
 * Useful for building dynamic field lists or conditions.
 *
 * @param values - The values to join
 * @param separator - The separator to use (default: ', ')
 * @returns A RawValue containing the joined escaped values
 *
 * @example
 * const fields = ['Name', 'Email', 'Phone'];
 * soql`SELECT ${join(fields.map(f => raw(f)))} FROM Contact`
 * // → SELECT Name, Email, Phone FROM Contact
 *
 * @example
 * const conditions = [raw('IsActive = true'), raw('Type = \'Customer\'')];
 * soql`SELECT Id FROM Account WHERE ${join(conditions, ' AND ')}`
 * // → SELECT Id FROM Account WHERE IsActive = true AND Type = 'Customer'
 */
export const join = (values: SoqlValue[], separator: string = ', '): RawValue => {
  const escaped = values.map((v) => escapeValue(v)).join(separator);
  return raw(escaped);
};
