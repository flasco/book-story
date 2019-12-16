const path = require('path');
const merge = require('webpack-merge');
const getBaseConfig = require('./webpack.base');
const { STATIC_PATH, MAIN_JS } = require('./base');

process.env.PROJECT_ENV = 'development';

module.exports = merge.smart(getBaseConfig(), {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: ['react-hot-loader/patch', path.resolve(__dirname, MAIN_JS)],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: ['react-hot-loader/babel'],
            },
          },
          'react-hot-loader/webpack',
        ],
      },
    ],
  },
  output: {
    path: path.join(__dirname, STATIC_PATH),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8207/',
  },
});
