import type { SoqlValue } from './types';
import { escapeValue } from './escape';

/**
 * Tagged template literal for creating safe SOQL queries.
 * Automatically escapes interpolated values based on their type.
 *
 * @example
 * const name = "O'Brien";
 * const query = soql`SELECT Id FROM Account WHERE Name = ${name}`;
 * // → SELECT Id FROM Account WHERE Name = 'O\'Brien'
 *
 * @example
 * const ids = ['001xx1', '001xx2'];
 * const query = soql`SELECT Id FROM Account WHERE Id IN ${ids}`;
 * // → SELECT Id FROM Account WHERE Id IN ('001xx1', '001xx2')
 *
 * @example
 * const isActive = true;
 * const query = soql`SELECT Id FROM Account WHERE IsActive = ${isActive}`;
 * // → SELECT Id FROM Account WHERE IsActive = true
 */
export const soql = (strings: TemplateStringsArray, ...values: SoqlValue[]): string => {
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];

    if (i < values.length) {
      result += escapeValue(values[i]);
    }
  }

  return result;
};
