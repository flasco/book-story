const webpack = require('webpack');
const path = require('path');
const { DIST_PATH } = require('./base');
const resolve = require('path').resolve;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 为了能取到不同配置里设置的环境变量，改成 function
module.exports = () => {
  const isDev = process.env.PROJECT_ENV === 'development';

  const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

  const config = {
    module: {
      rules: [
        // 原生node
        {
          test: /\.node$/,
          use: 'node-loader',
        },
        // WOFF Font
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        },
        // WOFF2 Font
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        },
        // TTF Font
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
            },
          },
        },
        // EOT Font
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader',
        },
        // SVG Font
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
            },
          },
        },
        // Common Image Formats
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
          use: 'url-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                plugins: ['react-hot-loader/babel'],
              },
            },
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [styleLoader, 'css-loader'],
        },
        {
          test: /\.m\.scss$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.m\.scss$/,
          use: [styleLoader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    target: 'web',
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      alias: {
        '@': resolve(__dirname, '../src'),
      },
      mainFields: ['module', 'main'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PROJECT_ENV: JSON.stringify(process.env.PROJECT_ENV),
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index-template.ejs',
        templateParameters: {
          IS_DEV: isDev,
          VENDOR: './dll/vendor.dll.js', //manifest就是dll生成的json
        },
        filename: 'index.html',
      }),
    ],
  };

  if (!isDev) {
    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: path.join(__dirname, `${DIST_PATH}/vendor-manifest.json`),
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name]-[hash:6].css',
      }),
      new CompressionWebpackPlugin({
        test: /\.(js|css)/,
      })
    );
  }

  return config;
};
