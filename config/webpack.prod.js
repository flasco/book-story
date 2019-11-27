const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');

const getBaseConfig = require('./webpack.base');
const { DIST_PATH, MAIN_JS } = require('./base');

process.env.PROJECT_ENV = 'production';

module.exports = merge.smart(getBaseConfig(), {
  mode: 'production',
  entry: [path.resolve(__dirname, MAIN_JS)],
  plugins: [
    new CleanWebpackPlugin({
      verbose: false,
      cleanOnceBeforeBuildPatterns: ['css/*.*', 'js/*.*'],
      root: path.resolve(__dirname, DIST_PATH)
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, DIST_PATH),
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  output: {
    path: path.join(__dirname, DIST_PATH),
    filename: 'js/bundle.js'
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({}), new TerserPlugin()]
  }
});
