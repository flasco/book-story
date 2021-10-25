import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImport from 'vite-plugin-babel-import';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';
import macrosPlugin from 'vite-plugin-babel-macros';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';
import path from 'path';

import { generateVersion } from './scripts/utils.js';

export default defineConfig({
  base: './',
  plugins: [
    react({
      include: '**/*.tsx',
    }),
    macrosPlugin(),
    PkgConfig(),
    OptimizationPersist(),
    viteCompression({
      filter: /\.(js|css)$/i,
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
  server: {
    fs: {
      strict: false,
    },
  },
  build: {
    emptyOutDir: true,
  },
  define: {
    ENV: JSON.stringify({
      PROJECT_VERSION_TAG: generateVersion(),
    }),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
