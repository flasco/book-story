const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');

const getBaseConfig = require('./webpack.base');
const { DIST_PATH, MAIN_JS, STATIC_PATH } = require('./base');

process.env.PROJECT_ENV = 'production';

module.exports = merge.smart(getBaseConfig(), {
  mode: 'production',
  entry: [path.resolve(__dirname, MAIN_JS)],
  plugins: [
    new CleanWebpackPlugin({
      verbose: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!**/vendor*', '!**/dll*'],
      root: path.resolve(__dirname, DIST_PATH),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, STATIC_PATH),
          to: path.resolve(__dirname, DIST_PATH),
          filter: resourcePath => {
            return !resourcePath.includes('index-template.ejs');
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  output: {
    path: path.join(__dirname, DIST_PATH),
    filename: 'js/bundle-[chunkhash:6].js',
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
});
