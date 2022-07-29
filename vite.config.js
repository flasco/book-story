import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
// import legacy from '@vitejs/plugin-legacy';
import macrosPlugin from 'vite-plugin-babel-macros';
// import { visualizer as analyze } from 'rollup-plugin-visualizer';

import { version } from './package.json';

export default defineConfig({
  base: './',
  plugins: [
    react({
      include: '**/*.tsx',
    }),
    macrosPlugin(),
    viteCompression({
      filter: /\.(js|css)$/i,
    }),
    // legacy({
    //   targets: ['android >= 4.4', 'ios >= 9', 'chrome>39'],
    // }),
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
      // plugins: [analyze()],
    },
  },
  // optimizeDeps: {
  //   disabled: false,
  //   devScan: true
  // },
  define: {
    ENV: JSON.stringify({
      PROJECT_VERSION_TAG: `${version}（${new Date().toLocaleDateString('zh')}）`,
    }),
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'),
      lodash: 'lodash-es',
    },
  },
});
