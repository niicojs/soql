/**
 * Marker interface for raw (unescaped) values.
 * Use with caution - only for trusted field names, operators, etc.
 */
export interface RawValue {
  readonly __raw: true;
  readonly value: string;
}

/**
 * Marker interface for LIKE pattern values.
 * These receive special escaping for LIKE wildcards.
 */
export interface LikeValue {
  readonly __like: true;
  readonly value: string;
}

/**
 * All possible value types that can be interpolated into a SOQL query.
 */
export type SoqlValue = string | number | boolean | Date | null | undefined | RawValue | LikeValue | SoqlValue[];
