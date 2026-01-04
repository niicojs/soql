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

// Dates
const date = new Date('2024-03-15T14:30:45.000Z');
soql`SELECT Id FROM Account WHERE CreatedDate > ${date}`;
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

Use `like()` for LIKE clause patterns - it escapes special LIKE characters (%, _):

```typescript
import { soql, like } from '@niicojs/soql';

const search = like('%test%');
soql`SELECT Id FROM Account WHERE Name LIKE ${search}`;
// → SELECT Id FROM Account WHERE Name LIKE '\%test\%'
```

### SOQL Injection Prevention

The library automatically escapes dangerous characters to prevent SOQL injection:

```typescript
const malicious = "'; DELETE FROM Account; --";
soql`SELECT Id FROM Account WHERE Name = ${malicious}`;
// → SELECT Id FROM Account WHERE Name = '\'; DELETE FROM Account; --'
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

### Escape Utilities

For advanced use cases, individual escape functions are exported:

```typescript
import {
  escapeString,    // Escape a string value
  escapeLike,      // Escape a LIKE pattern value
  escapeValue,     // Escape any supported value type
  escapeArray,     // Escape an array for IN clauses
  formatDate,      // Format Date as YYYY-MM-DD
  formatDateTime,  // Format Date as YYYY-MM-DDThh:mm:ssZ
} from '@niicojs/soql';
```

## Requirements

- Node.js >= 20

## License

MIT
