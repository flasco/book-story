const webpack = require('webpack');
const path = require('path');
const { STATIC_PATH } = require('./base');
const resolve = require('path').resolve;

// 为了能取到不同配置里设置的环境变量，改成 function
module.exports = () => {
  return {
    module: {
      rules: [
        // 原生node
        {
          test: /\.node$/,
          use: 'node-loader'
        },
        // WOFF Font
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        },
        // WOFF2 Font
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        },
        // TTF Font
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          }
        },
        // EOT Font
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader'
        },
        // SVG Font
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml'
            }
          }
        },
        // Common Image Formats
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
          use: 'url-loader'
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                plugins: [
                  [
                    require.resolve('babel-plugin-zent'),
                    {
                      automaticStyleImport: true,
                    },
                  ],
                  'react-hot-loader/babel',
                ],
              },
            },
            {
              loader: 'ts-loader'
            }
          ]
        }
      ]
    },
    target: 'web',
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      alias: {
        '@': resolve(__dirname, '../src'),
      }
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: path.join(__dirname, `${STATIC_PATH}/vendor-manifest.json`)
      }),
      new webpack.DefinePlugin({
        "process.env": {
          PROJECT_ENV: JSON.stringify(process.env.PROJECT_ENV)
        }
      })
    ]
  }
};
