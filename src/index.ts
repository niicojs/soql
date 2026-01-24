// Main template tag
export { soql } from './soql';

// Helper functions
export { raw, like, date, literal } from './helpers';

// Escape utilities (for advanced usage)
export { escapeString, escapeLike, escapeValue, escapeArray, formatDate, formatDateTime, join } from './escape';

// Types
export type { SoqlValue, RawValue, LikeValue, DateValue, DateLiteral } from './types';

// Symbols (for advanced type checking)
export { RAW_SYMBOL, LIKE_SYMBOL, DATE_SYMBOL } from './types';
