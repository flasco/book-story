const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getRandomId } = require('../utils');
const alias = require('./alias');

const randomId = getRandomId();
console.log('version tag:', randomId);

// 为了能取到不同配置里设置的环境变量，改成 function
module.exports = () => {
  const isDev = process.env.PROJECT_ENV === 'development';

  const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

  const babelOpts = {
    cacheDirectory: true,
    babelrc: false,
    plugins: [
      [require.resolve('babel-plugin-import'), { libraryName: 'antd-mobile', style: 'css' }], // `style: true` 会加载 less 文件
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-transform-runtime'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
    ],
    presets: [
      require.resolve('@babel/preset-env'),
      [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
    ],
  };

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()],
    },
  };

  if (isDev) babelOpts.plugins.unshift('react-hot-loader/babel');

  const config = {
    context: path.resolve(__dirname, '../../'),
    cache: {
      type: 'filesystem',
    },
    module: {
      rules: [
        // 原生node
        {
          test: /\.node$/,
          use: 'node-loader',
        },
        // Font
        {
          test: /\.(ttf|woff|woff2|eot|otf)$/,
          type: 'asset',
          generator: {
            filename: 'assets/[hash:6][ext][query]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb
            },
          },
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          type: 'asset',
          generator: {
            filename: 'assets/[hash:6][ext][query]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOpts,
            },
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [styleLoader, 'css-loader', postCssLoader],
        },
        {
          test: /\.m\.scss$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDev ? '[local]--[hash:base64:4]' : '[hash:base64:4]',
                },
              },
            },
            postCssLoader,
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.m\.scss$/,
          use: [styleLoader, 'css-loader', postCssLoader, 'sass-loader'],
        },
      ],
    },
    target: 'web',
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      alias,
      extensions: ['.ts', '.js', '.tsx'],
      mainFields: ['module', 'main'],
      modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PROJECT_ENV: JSON.stringify(process.env.PROJECT_ENV),
          PROJECT_VERSION_TAG: JSON.stringify(randomId),
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index-template.ejs',
        // templateParameters: {
        //   IS_DEV: isDev,
        // },
        filename: 'index.html',
      }),
    ],
  };

  if (!isDev) {
    config.plugins.unshift(
      new MiniCssExtractPlugin({
        filename: 'css/[name]-[chunkhash:6].css',
      }),
      new CompressionWebpackPlugin({
        test: /\.(js|css)/,
      })
    );
  }

  return config;
};
