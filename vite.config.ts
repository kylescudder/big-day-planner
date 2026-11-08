import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000
  },
  resolve: {
    tsconfigPaths: true,
    // Libraries that import the use-sync-external-store shim (Base UI,
    // TanStack Store) get React 18+'s built-in instead.
    // See https://github.com/TanStack/router/issues/5738
    alias: [
      { find: 'use-sync-external-store/shim/index.js', replacement: 'react' }
    ]
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()]
})
