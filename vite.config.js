import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginImp from 'vite-plugin-imp';
import path from 'path';

export default defineConfig({
  plugins: [
    reactRefresh(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd-mobile',
          style: name => `antd-mobile/lib/${name}/style/index.css`,
        },
      ],
    }),
  ],
  define: {
    ENV: JSON.stringify({
      PROJECT_VERSION_TAG: '123',
    }),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
