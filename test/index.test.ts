import { describe, it, expect } from 'vitest';
import {
  soql,
  raw,
  like,
  escapeString,
  escapeLike,
  escapeValue,
  escapeArray,
  formatDate,
  formatDateTime,
} from '../src';

describe('escapeString', () => {
  it('escapes single quotes', () => {
    expect(escapeString("O'Brien")).toBe("O\\'Brien");
  });

  it('escapes backslashes', () => {
    expect(escapeString('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('escapes newlines', () => {
    expect(escapeString('line1\nline2')).toBe('line1\\nline2');
  });

  it('escapes carriage returns', () => {
    expect(escapeString('line1\rline2')).toBe('line1\\rline2');
  });

  it('escapes tabs', () => {
    expect(escapeString('col1\tcol2')).toBe('col1\\tcol2');
  });

  it('escapes null bytes', () => {
    expect(escapeString('data\0end')).toBe('data\\0end');
  });

  it('handles combined escape sequences', () => {
    expect(escapeString("It's a\nnew\\day")).toBe("It\\'s a\\nnew\\\\day");
  });

  it('handles empty strings', () => {
    expect(escapeString('')).toBe('');
  });
});

describe('escapeLike', () => {
  it('escapes percent signs', () => {
    expect(escapeLike('100%')).toBe('100\\%');
  });

  it('escapes underscores', () => {
    expect(escapeLike('test_value')).toBe('test\\_value');
  });

  it('escapes single quotes', () => {
    expect(escapeLike("O'Brien")).toBe("O\\'Brien");
  });

  it('escapes backslashes', () => {
    expect(escapeLike('path\\file')).toBe('path\\\\file');
  });

  it('handles combined LIKE escapes', () => {
    expect(escapeLike("50%_test's")).toBe("50\\%\\_test\\'s");
  });
});

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const date = new Date('2024-03-15T12:00:00Z');
    expect(formatDate(date)).toBe('2024-03-15');
  });

  it('pads single digit months and days', () => {
    const date = new Date('2024-01-05T00:00:00Z');
    expect(formatDate(date)).toBe('2024-01-05');
  });
});

describe('formatDateTime', () => {
  it('formats a datetime correctly', () => {
    const date = new Date('2024-03-15T14:30:45.123Z');
    expect(formatDateTime(date)).toBe('2024-03-15T14:30:45Z');
  });

  it('handles midnight', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');
    expect(formatDateTime(date)).toBe('2024-01-01T00:00:00Z');
  });
});

describe('escapeArray', () => {
  it('escapes an array of strings', () => {
    expect(escapeArray(['a', 'b', 'c'])).toBe("('a', 'b', 'c')");
  });

  it('escapes an array with special characters', () => {
    expect(escapeArray(["O'Brien", 'Smith'])).toBe("('O\\'Brien', 'Smith')");
  });

  it('handles empty arrays', () => {
    expect(escapeArray([])).toBe('(null)');
  });

  it('handles mixed types', () => {
    expect(escapeArray(['active', true, 42])).toBe("('active', true, 42)");
  });
});

describe('escapeValue', () => {
  it('escapes strings with quotes', () => {
    expect(escapeValue('test')).toBe("'test'");
  });

  it('escapes strings without quotes when specified', () => {
    expect(escapeValue('test', false)).toBe('test');
  });

  it('handles null', () => {
    expect(escapeValue(null)).toBe('null');
  });

  it('handles undefined', () => {
    expect(escapeValue(undefined)).toBe('null');
  });

  it('handles booleans', () => {
    expect(escapeValue(true)).toBe('true');
    expect(escapeValue(false)).toBe('false');
  });

  it('handles integers', () => {
    expect(escapeValue(42)).toBe('42');
  });

  it('handles negative numbers', () => {
    expect(escapeValue(-123)).toBe('-123');
  });

  it('handles floats', () => {
    expect(escapeValue(3.14159)).toBe('3.14159');
  });

  it('throws on Infinity', () => {
    expect(() => escapeValue(Infinity)).toThrow('Invalid SOQL number value');
  });

  it('throws on NaN', () => {
    expect(() => escapeValue(NaN)).toThrow('Invalid SOQL number value');
  });

  it('handles Date objects', () => {
    const date = new Date('2024-03-15T14:30:45.000Z');
    expect(escapeValue(date)).toBe('2024-03-15T14:30:45Z');
  });

  it('throws on invalid Date', () => {
    expect(() => escapeValue(new Date('invalid'))).toThrow('Invalid Date object');
  });

  it('handles arrays', () => {
    expect(escapeValue(['a', 'b'])).toBe("('a', 'b')");
  });

  it('handles raw values', () => {
    expect(escapeValue(raw('Name'))).toBe('Name');
  });

  it('handles like values', () => {
    expect(escapeValue(like('%test%'))).toBe("'\\%test\\%'");
  });
});

describe('raw', () => {
  it('creates a raw value marker', () => {
    const r = raw('Field__c');
    expect(r.__raw).toBe(true);
    expect(r.value).toBe('Field__c');
  });
});

describe('like', () => {
  it('creates a like value marker', () => {
    const l = like('%search%');
    expect(l.__like).toBe(true);
    expect(l.value).toBe('%search%');
  });
});

describe('soql', () => {
  it('creates a simple query', () => {
    const query = soql`SELECT Id FROM Account`;
    expect(query).toBe('SELECT Id FROM Account');
  });

  it('escapes string values', () => {
    const name = "O'Brien";
    const query = soql`SELECT Id FROM Account WHERE Name = ${name}`;
    expect(query).toBe("SELECT Id FROM Account WHERE Name = 'O\\'Brien'");
  });

  it('handles boolean values', () => {
    const isActive = true;
    const query = soql`SELECT Id FROM Account WHERE IsActive = ${isActive}`;
    expect(query).toBe('SELECT Id FROM Account WHERE IsActive = true');
  });

  it('handles numeric values', () => {
    const amount = 1000.5;
    const query = soql`SELECT Id FROM Account WHERE Amount__c > ${amount}`;
    expect(query).toBe('SELECT Id FROM Account WHERE Amount__c > 1000.5');
  });

  it('handles null values', () => {
    const query = soql`SELECT Id FROM Account WHERE Parent = ${null}`;
    expect(query).toBe('SELECT Id FROM Account WHERE Parent = null');
  });

  it('handles arrays for IN clauses', () => {
    const ids = ['001xx1', '001xx2', '001xx3'];
    const query = soql`SELECT Id FROM Account WHERE Id IN ${ids}`;
    expect(query).toBe("SELECT Id FROM Account WHERE Id IN ('001xx1', '001xx2', '001xx3')");
  });

  it('handles Date values', () => {
    const date = new Date('2024-03-15T10:30:00.000Z');
    const query = soql`SELECT Id FROM Account WHERE CreatedDate > ${date}`;
    expect(query).toBe('SELECT Id FROM Account WHERE CreatedDate > 2024-03-15T10:30:00Z');
  });

  it('handles raw values for field names', () => {
    const field = raw('Custom_Field__c');
    const query = soql`SELECT ${field} FROM Account`;
    expect(query).toBe('SELECT Custom_Field__c FROM Account');
  });

  it('handles like values for LIKE patterns', () => {
    const search = like('%test%');
    const query = soql`SELECT Id FROM Account WHERE Name LIKE ${search}`;
    expect(query).toBe("SELECT Id FROM Account WHERE Name LIKE '\\%test\\%'");
  });

  it('handles multiple interpolations', () => {
    const name = 'Acme';
    const isActive = true;
    const amount = 500;
    const query = soql`SELECT Id FROM Account WHERE Name = ${name} AND IsActive = ${isActive} AND Amount__c > ${amount}`;
    expect(query).toBe("SELECT Id FROM Account WHERE Name = 'Acme' AND IsActive = true AND Amount__c > 500");
  });

  it('prevents SOQL injection', () => {
    const malicious = "'; DELETE FROM Account; --";
    const query = soql`SELECT Id FROM Account WHERE Name = ${malicious}`;
    expect(query).toBe("SELECT Id FROM Account WHERE Name = '\\'; DELETE FROM Account; --'");
  });

  it('prevents injection via array values', () => {
    const malicious = ["a', 'b') OR Id != '"];
    const query = soql`SELECT Id FROM Account WHERE Id IN ${malicious}`;
    expect(query).toBe("SELECT Id FROM Account WHERE Id IN ('a\\', \\'b\\') OR Id != \\'')");
  });
});
