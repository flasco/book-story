import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx',
    }),
    vitePluginImport([
      {
        libraryName: 'antd-mobile-v5',
        libraryDirectory: 'es/components',
        style: name => `antd-mobile-v5/es/components/${name}/${name}.css`,
      },
    ]),
  ],
  define: {
    ENV: JSON.stringify({
      PROJECT_VERSION_TAG: '123',
      PROJECT_ENV: 'development',
    }),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
