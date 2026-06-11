/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

// The site is published at https://suzuenhasa.github.io/madmathminute/, so all
// asset URLs must be prefixed with the repo name. If you ever move it to a
// custom domain or the repo root, change `base` to '/'.
export default defineConfig({
  base: '/madmathminute/',
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
