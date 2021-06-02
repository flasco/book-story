import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path';

export default defineConfig({
  plugins: [
    reactRefresh(),
    vitePluginImport([
      {
        libraryName: 'antd-mobile',
        libraryDirectory: 'es',
        style: name => `antd-mobile/es/${name}/style/index.css`,
      },
    ]),
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
