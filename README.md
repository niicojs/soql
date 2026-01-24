# @niicojs/soql

A safe SOQL template literal tag for escaping values in Salesforce SOQL queries.

## Installation

```bash
npm install @niicojs/soql
```

## Usage

### Basic Query Building

Use the `soql` template tag to safely interpolate values into your SOQL queries:

```typescript
import { soql } from '@niicojs/soql';

const name = "O'Brien";
const query = soql`SELECT Id FROM Account WHERE Name = ${name}`;
// → SELECT Id FROM Account WHERE Name = 'O\'Brien'
```

### Supported Value Types

The `soql` tag automatically handles escaping for various types:

```typescript
// Strings - automatically quoted and escaped
const name = 'Acme Corp';
soql`SELECT Id FROM Account WHERE Name = ${name}`;
// → SELECT Id FROM Account WHERE Name = 'Acme Corp'

// Numbers
const amount = 1000.5;
soql`SELECT Id FROM Account WHERE Amount__c > ${amount}`;
// → SELECT Id FROM Account WHERE Amount__c > 1000.5

// Booleans
const isActive = true;
soql`SELECT Id FROM Account WHERE IsActive = ${isActive}`;
// → SELECT Id FROM Account WHERE IsActive = true

// null
soql`SELECT Id FROM Account WHERE Parent = ${null}`;
// → SELECT Id FROM Account WHERE Parent = null

// Dates (formatted as datetime by default)
const d = new Date('2024-03-15T14:30:45.000Z');
soql`SELECT Id FROM Account WHERE CreatedDate > ${d}`;
// → SELECT Id FROM Account WHERE CreatedDate > 2024-03-15T14:30:45Z

// Arrays (for IN clauses)
const ids = ['001xx1', '001xx2', '001xx3'];
soql`SELECT Id FROM Account WHERE Id IN ${ids}`;
// → SELECT Id FROM Account WHERE Id IN ('001xx1', '001xx2', '001xx3')
```

### Raw Values

Use `raw()` for trusted field names or other unescaped values:

```typescript
import { soql, raw } from '@niicojs/soql';

const field = raw('Custom_Field__c');
soql`SELECT ${field} FROM Account`;
// → SELECT Custom_Field__c FROM Account
```

**Warning:** Only use `raw()` with trusted values. User input passed to `raw()` could enable SOQL injection.

### LIKE Patterns

Use `like()` for LIKE clause patterns - it escapes special LIKE characters (%, \_):

```typescript
import { soql, like } from '@niicojs/soql';

const search = like('%test%');
soql`SELECT Id FROM Account WHERE Name LIKE ${search}`;
// → SELECT Id FROM Account WHERE Name LIKE '\%test\%'
```

### Date-Only Values

Use `date()` to force date-only formatting (YYYY-MM-DD) instead of datetime:

```typescript
import { soql, date } from '@niicojs/soql';

const d = new Date('2024-03-15T14:30:45.000Z');
soql`SELECT Id FROM Contact WHERE Birthdate = ${date(d)}`;
// → SELECT Id FROM Contact WHERE Birthdate = 2024-03-15
```

### Date Literals

Use `literal()` for SOQL date literals like `TODAY`, `YESTERDAY`, `LAST_N_DAYS:n`, etc.:

```typescript
import { soql, literal } from '@niicojs/soql';

soql`SELECT Id FROM Account WHERE CreatedDate > ${literal('YESTERDAY')}`;
// → SELECT Id FROM Account WHERE CreatedDate > YESTERDAY

soql`SELECT Id FROM Account WHERE CreatedDate > ${literal('LAST_N_DAYS:30')}`;
// → SELECT Id FROM Account WHERE CreatedDate > LAST_N_DAYS:30
```

Supported date literals include:

- `TODAY`, `YESTERDAY`, `TOMORROW`
- `LAST_WEEK`, `THIS_WEEK`, `NEXT_WEEK`
- `LAST_MONTH`, `THIS_MONTH`, `NEXT_MONTH`
- `LAST_90_DAYS`, `NEXT_90_DAYS`
- `THIS_QUARTER`, `LAST_QUARTER`, `NEXT_QUARTER`
- `THIS_YEAR`, `LAST_YEAR`, `NEXT_YEAR`
- `THIS_FISCAL_QUARTER`, `LAST_FISCAL_QUARTER`, `NEXT_FISCAL_QUARTER`
- `THIS_FISCAL_YEAR`, `LAST_FISCAL_YEAR`, `NEXT_FISCAL_YEAR`
- `LAST_N_DAYS:n`, `NEXT_N_DAYS:n`
- `LAST_N_WEEKS:n`, `NEXT_N_WEEKS:n`
- `LAST_N_MONTHS:n`, `NEXT_N_MONTHS:n`
- `LAST_N_QUARTERS:n`, `NEXT_N_QUARTERS:n`
- `LAST_N_YEARS:n`, `NEXT_N_YEARS:n`
- And fiscal variants...

### Dynamic Field Lists

Use `join()` to build dynamic field lists or conditions:

```typescript
import { soql, raw, join } from '@niicojs/soql';

// Dynamic field selection
const fields = ['Id', 'Name', 'Email'].map((f) => raw(f));
soql`SELECT ${join(fields)} FROM Contact`;
// → SELECT Id, Name, Email FROM Contact

// Dynamic conditions
const conditions = [raw('IsActive = true'), raw("Type = 'Customer'")];
soql`SELECT Id FROM Account WHERE ${join(conditions, ' AND ')}`;
// → SELECT Id FROM Account WHERE IsActive = true AND Type = 'Customer'
```

### SOQL Injection Prevention

The library automatically escapes dangerous characters to prevent SOQL injection:

```typescript
const malicious = "'; DELETE FROM Account; --";
soql`SELECT Id FROM Account WHERE Name = ${malicious}`;
// → SELECT Id FROM Account WHERE Name = '\'; DELETE FROM Account; --'
```

### Empty Arrays

Empty arrays in IN clauses will throw an error, as this is typically a programming mistake:

```typescript
const ids: string[] = [];
soql`SELECT Id FROM Account WHERE Id IN ${ids}`;
// → Throws: "Empty arrays are not allowed in SOQL IN clauses..."
```

Handle this by checking the array before building the query:

```typescript
if (ids.length > 0) {
  const query = soql`SELECT Id FROM Account WHERE Id IN ${ids}`;
  // execute query
}
```

## API Reference

### `soql`

Tagged template literal for creating safe SOQL queries.

```typescript
const query = soql`SELECT Id FROM ${raw('Account')} WHERE Name = ${name}`;
```

### `raw(value: string): RawValue`

Creates a raw (unescaped) value. Use for trusted field names, object names, etc.

### `like(value: string): LikeValue`

Creates a LIKE pattern value with special escaping for LIKE wildcards.

### `date(value: Date): DateValue`

Creates a date-only value (formats as YYYY-MM-DD instead of datetime).

### `literal(value: DateLiteral): RawValue`

Creates a SOQL date literal value (TODAY, LAST_N_DAYS:n, etc.).

### `join(values: SoqlValue[], separator?: string): RawValue`

Joins multiple values with a separator (default: `', '`).

### Escape Utilities

For advanced use cases, individual escape functions are exported:

```typescript
import {
  escapeString, // Escape a string value
  escapeLike, // Escape a LIKE pattern value
  escapeValue, // Escape any supported value type
  escapeArray, // Escape an array for IN clauses
  formatDate, // Format Date as YYYY-MM-DD
  formatDateTime, // Format Date as YYYY-MM-DDThh:mm:ssZ
} from '@niicojs/soql';
```

### Type Exports

```typescript
import type {
  SoqlValue, // Union of all supported value types
  RawValue, // Raw (unescaped) value marker
  LikeValue, // LIKE pattern value marker
  DateValue, // Date-only value marker
  DateLiteral, // SOQL date literal types
} from '@niicojs/soql';
```

### Symbol Exports

For advanced type checking, the internal symbols are exported:

```typescript
import { RAW_SYMBOL, LIKE_SYMBOL, DATE_SYMBOL } from '@niicojs/soql';
```

## Requirements

- Node.js >= 20

## License

MIT
