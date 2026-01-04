# AGENTS.md

This file provides guidance for AI coding agents working in this repository.

## Project Overview

- **Package**: `@niicojs/soql` - A soql template script to escape SOQL strings safely.
- **Language**: TypeScript
- **Module System**: ES Modules (`"type": "module"`)
- **Node.js Version**: Requires Node.js >= 20
- **License**: MIT

## Directory Structure

```
soql/
├── src/              # Source code (TypeScript)
│   └── index.ts      # Main entry point
├── test/             # Test files
│   └── *.test.ts     # Test files (Vitest)
├── dist/             # Build output (generated)
├── package.json      # Package configuration
├── tsconfig.json     # TypeScript configuration
└── vitest.config.ts  # Test configuration
```

## Build/Lint/Test Commands

**Package Manager**: Bun (use `bun` for all commands)

```bash
bun install              # Install dependencies
bun run build            # Build the package
bun run typecheck        # Type check
bun run dev              # Development mode
```

### Linting & Formatting

```bash
bun run lint             # Check for lint errors
bun run lint --fix       # Auto-fix lint errors
bun run format           # Format all files
bun run format:check     # Check formatting without modifying
```

### Testing

```bash
bun run test                     # Run all tests once
bun run test:watch               # Run tests in watch mode
bun run test test/index.test.ts  # Run a single test file
bun run test -t "pattern"        # Run tests matching a pattern
bun run test --coverage          # Run tests with coverage
bun run test --update            # Update snapshots
```

## Code Style Guidelines

### TypeScript Configuration

This project uses strict TypeScript settings:

- `strict: true` - All strict type checking options enabled
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noFallthroughCasesInSwitch: true` - Error on fallthrough in switch statements
- `noImplicitReturns: true` - Error when not all code paths return a value

### Formatting

The project uses oxfmt (via tsdx) for formatting. Run `bun run format` to format code.

- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline structures

### Imports

```typescript
// External dependencies first
import { describe, it, expect } from 'vitest';

// Internal imports second (use relative paths)
import { sum } from '../src';
```

- Use named exports/imports (avoid default exports)
- Import from package index when possible (`'../src'` not `'../src/index'`)
- Group imports: external dependencies, then internal modules

### Naming Conventions

- **Functions/Variables**: camelCase (`sum`, `myFunction`)
- **Types/Interfaces**: PascalCase (`MyType`, `UserData`)
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants
- **Files**: kebab-case for multi-word files (`my-module.ts`)
- **Test files**: `*.test.ts` pattern in `test/` directory

### Function Style

- Always specify explicit return types for functions
- Use arrow functions for exported functions
- Add JSDoc comments for public API functions

```typescript
/**
 * Adds two numbers together.
 */
export const sum = (a: number, b: number): number => {
  return a + b;
};
```

### Type Annotations & Error Handling

- Always provide explicit type annotations for function parameters and return types
- Prefer interfaces for object shapes, type aliases for unions/intersections
- Use typed errors, handle errors explicitly, propagate with meaningful context

### Testing

Tests use Vitest with globals enabled:

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../src';

describe('functionName', () => {
  it('describes the expected behavior', () => {
    expect(functionToTest(input)).toBe(expectedOutput);
  });

  it('handles edge cases', () => {
    expect(functionToTest(edgeCase)).toBe(expectedResult);
  });
});
```

- Place tests in `test/` directory with `.test.ts` extension
- Use descriptive `describe` blocks for grouping related tests
- Use clear `it` descriptions that explain expected behavior
- Test both happy path and edge cases

## CI/CD

The project runs CI on:

- Node.js versions: 20, 22
- Operating systems: Ubuntu, Windows, macOS

CI pipeline runs: lint -> typecheck -> test -> build

## Common Tasks

### Adding a New Feature

1. Add source code in `src/`
2. Export from `src/index.ts`
3. Add tests in `test/`
4. Run `bun run lint --fix && bun run typecheck && bun run test`

### Before Committing

```bash
bun run lint --fix
bun run format
bun run typecheck
bun run test
bun run build
```
