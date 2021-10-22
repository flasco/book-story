import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImport from 'vite-plugin-babel-import';
import legacy from '@vitejs/plugin-legacy';
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
    legacy({
      targets: ['android >= 4.4', 'ios >= 9', 'not IE 11'],
    }),
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
