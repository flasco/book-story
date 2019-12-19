const Koa = require('koa');
const path = require('path');
const koaWebpack = require('koa-webpack');
const cors = require('koa2-cors');
const staticx = require('koa-static');

const config = require('../config/webpack.dev');
const { STATIC_PATH } = require('../config/base');

async function start() {
  const app = new Koa();

  const root = path.resolve(__dirname, STATIC_PATH);

  app.use(staticx(root));

  koaWebpack({
    config,
    devMiddleware: {
      stats: {
        modules: false,
        children: false,
        performance: false,
        entrypoints: false,
        colors: true,
      },
    },
  }).then(middleware => {
    app.use(middleware);
  });

  app.use(cors());

  const port = 8207;

  app.listen(port, () => {
    console.log(`serverURL: http://localhost:${port}`);
  });
}

start();
