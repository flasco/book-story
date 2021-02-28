const Wds = require('webpack-dev-server');
const Webpack = require('webpack');
const path = require('path');

const configDev = require('../config/webpack.dev');

const compiler = Webpack(configDev);

const port = 8207;

const devServerOptions = Object.assign({
  open: true,
  compress: true,
  port,
  static: path.resolve(__dirname, '../../public'),
  // clientLogLevel: 'info',
});

const server = new Wds(compiler, devServerOptions);

server.listen(port, '127.0.0.1', () => {
  console.log(`Starting server on http://localhost:${port}`);
});
