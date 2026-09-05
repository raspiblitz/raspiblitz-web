/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite"
import packageJson from "./package.json";

// API base URL, including /api when using the mock or a node's reverse proxy.
const BACKEND_SERVER = process.env.BACKEND_SERVER || 'http://localhost:8000/api';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_COMMIT__: JSON.stringify(process.env.VITE_BUILD_COMMIT ?? "unknown"),
  },
  plugins: [react(), viteTsconfigPaths(), svgr(), tailwindcss()],
  build: {
    outDir: 'build',
    // Opt in for diagnostic builds; normal releases omit the source maps.
    sourcemap: process.env.BUILD_SOURCEMAP === "true",
    rollupOptions: {
      output: {
        // see https://github.com/vitejs/vite/issues/11804#issuecomment-2009619365
        chunkFileNames: 'chunk-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: BACKEND_SERVER,
        rewrite: path => path.replace(/^\/api/, ''),
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'html'],
      all: true,
      include: ['src'],
      exclude: [
        'src/setupTests.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.d.ts',
        'src/testServer.ts',
        'src/utils/test-utils.tsx',
      ],
    },
  },
});
