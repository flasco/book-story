import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImport from 'vite-plugin-babel-import';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';
import macrosPlugin from 'vite-plugin-babel-macros';
import path from 'path';

const generateVersion = (generLen = 6) => {
  const strs = 'ABCDEFTUGHJTOKYabcdefghigklmnopqrstuvwxyz0123456789';
  let ver = '';
  for (let i = 0; i < generLen; i++) {
    ver += strs[(Math.random() * strs.length) | 0];
  }
  return ver;
};

export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx',
    }),
    macrosPlugin(),
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
