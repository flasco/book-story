const Koa = require('koa');
const path = require('path');
const koaWebpack = require('koa-webpack');
const cors = require('koa2-cors');
const static = require('koa-static');

const { checkMainfest, dllComplier } = require('./util');
const config = require('../config/webpack.dev');

async function start() {
  if (!(await checkMainfest())) {
    await dllComplier();
  }

  const app = new Koa();

  const root = path.resolve(__dirname, '../static');

  app.use(
    static(root, {
      index: 'index-dev.html'
    })
  );

  koaWebpack({
    config
  }).then(middleware => {
    app.use(middleware);
  });

  app.use(cors());

  app.listen(8207, () => {
    console.log('app listen at 8207');
  });
}

start();