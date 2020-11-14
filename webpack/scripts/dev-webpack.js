const Wds = require('webpack-dev-server');
const Webpack = require('webpack');
const configDev = require('../config/webpack.dev');

const compiler = Webpack(configDev);

const port = 8207;

const devServerOptions = Object.assign({
  open: true,
  compress: true,
  port,
  /**
   * FIXME: 影响到静态资源的读取，问题不大可以先放放
   * （注释开了的话，生成的 dev bundle 又会影响到public，应该单独开一个local，存放临时文件）
   */
  // contentBase: path.resolve(__dirname, '../../public'),
  stats: {
    modules: false,
    children: false,
    performance: false,
    entrypoints: false,
    colors: true,
  },
});

const server = new Wds(compiler, devServerOptions);

server.listen(port, '127.0.0.1', () => {
  console.log(`Starting server on http://localhost:${port}`);
});
