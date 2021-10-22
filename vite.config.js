import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx',
    }),
  ],
  define: {
    ENV: JSON.stringify({
      PROJECT_VERSION_TAG: '123',
      PROJECT_ENV: 'development',
    }),
  },
  // esbuild: {
  //   jsxInject: `import React from 'react'`,
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
