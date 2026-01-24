/**
 * Unique symbols for type identification.
 * Using Symbols prevents accidental matches with user objects.
 */
export const RAW_SYMBOL = Symbol.for('@niicojs/soql:raw');
export const LIKE_SYMBOL = Symbol.for('@niicojs/soql:like');
export const DATE_SYMBOL = Symbol.for('@niicojs/soql:date');

/**
 * Marker interface for raw (unescaped) values.
 * Use with caution - only for trusted field names, operators, etc.
 */
export interface RawValue {
  readonly [RAW_SYMBOL]: true;
  readonly value: string;
}

/**
 * Marker interface for LIKE pattern values.
 * These receive special escaping for LIKE wildcards.
 */
export interface LikeValue {
  readonly [LIKE_SYMBOL]: true;
  readonly value: string;
}

/**
 * Marker interface for Date-only values (without time component).
 * Forces formatting as YYYY-MM-DD instead of datetime.
 */
export interface DateValue {
  readonly [DATE_SYMBOL]: true;
  readonly value: Date;
}

/**
 * SOQL Date Literal types.
 * @see https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_select_dateformats.htm
 */
export type DateLiteral =
  | 'YESTERDAY'
  | 'TODAY'
  | 'TOMORROW'
  | 'LAST_WEEK'
  | 'THIS_WEEK'
  | 'NEXT_WEEK'
  | 'LAST_MONTH'
  | 'THIS_MONTH'
  | 'NEXT_MONTH'
  | 'LAST_90_DAYS'
  | 'NEXT_90_DAYS'
  | 'THIS_QUARTER'
  | 'LAST_QUARTER'
  | 'NEXT_QUARTER'
  | 'THIS_YEAR'
  | 'LAST_YEAR'
  | 'NEXT_YEAR'
  | 'THIS_FISCAL_QUARTER'
  | 'LAST_FISCAL_QUARTER'
  | 'NEXT_FISCAL_QUARTER'
  | 'THIS_FISCAL_YEAR'
  | 'LAST_FISCAL_YEAR'
  | 'NEXT_FISCAL_YEAR'
  | `LAST_N_DAYS:${number}`
  | `NEXT_N_DAYS:${number}`
  | `LAST_N_WEEKS:${number}`
  | `NEXT_N_WEEKS:${number}`
  | `LAST_N_MONTHS:${number}`
  | `NEXT_N_MONTHS:${number}`
  | `LAST_N_QUARTERS:${number}`
  | `NEXT_N_QUARTERS:${number}`
  | `LAST_N_YEARS:${number}`
  | `NEXT_N_YEARS:${number}`
  | `LAST_N_FISCAL_QUARTERS:${number}`
  | `NEXT_N_FISCAL_QUARTERS:${number}`
  | `LAST_N_FISCAL_YEARS:${number}`
  | `NEXT_N_FISCAL_YEARS:${number}`;

/**
 * All possible value types that can be interpolated into a SOQL query.
 */
export type SoqlValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | RawValue
  | LikeValue
  | DateValue
  | SoqlValue[];
