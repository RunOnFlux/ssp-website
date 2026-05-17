import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}', '__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'content'],
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.ts'],
    server: {
      deps: {
        // Force Vitest to bundle next-intl through its own Vite resolver so the
        // 'next/server' alias below is honoured.  Without this, Node's native
        // ESM loader sees the bare specifier and fails because next has no
        // package.json "exports" map entry for it.
        inline: ['next-intl'],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // next/server is a CJS-style bare specifier without an 'exports' entry in
      // next's package.json; Node's ESM resolver rejects it.  Map to the real
      // file so next-intl's ESM middleware can import NextRequest / NextResponse
      // inside Vitest without crashing.
      'next/server': resolve(__dirname, 'node_modules/next/server.js'),
    },
  },
})
