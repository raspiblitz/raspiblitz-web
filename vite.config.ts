/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const BACKEND_SERVER = 'http://localhost:8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgr()],
  build: {
    outDir: 'build',
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
        changeOrigin: true,
        secure: false,
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
