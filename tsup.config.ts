import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [
    '@inquirer/prompts',
    'chalk',
    'commander',
    'ora',
  ],
  treeshake: true,
  minify: false,
});
