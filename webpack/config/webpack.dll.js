const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { DIST_PATH, DLL_LIST } = require('./base');

module.exports = {
  // 要打包的模块的数组
  context: __dirname,
  entry: {
    vendor: DLL_LIST,
  },
  output: {
    path: path.join(__dirname, DIST_PATH), // 打包后文件输出的位置
    filename: 'dll/[name].dll.js', // vendor.dll.js中暴露出的全局变量名。
    library: '[name]_library', // 与webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, DIST_PATH, '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname,
    }),
    new CleanWebpackPlugin({
      verbose: false,
      cleanOnceBeforeBuildPatterns: ['dll/*'],
      root: path.resolve(__dirname, DIST_PATH),
    }),
    new CompressionWebpackPlugin(),
  ],
};
