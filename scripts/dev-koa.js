const Koa = require('koa');
const path = require('path');
const koaWebpack = require('koa-webpack');
const cors = require('koa2-cors');
const static = require('koa-static');

const config = require('../config/webpack.dev');

async function start() {
  const app = new Koa();

  const root = path.resolve(__dirname, '../public');

  app.use(
    static(root, {
      index: 'index-dev.html'
    })
  );

  koaWebpack({
    config,
    devMiddleware: {
      stats: {
        modules: false,
        children: false,
        performance: false,
        entrypoints: false,
        colors: true,
      }
    }
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