import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    printWidth: 120,
    singleQuote: true,
    sortImports: true,
    endOfLine: 'crlf',
  },
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm', 'cjs'],
    outDir: 'dist',
  },
});
