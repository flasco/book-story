const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DIST_PATH } = require('./base');
const alias = require('./alias');

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
    presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
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
