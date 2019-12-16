const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const static = require('koa-static');

const { DIST_PATH } = require('../config/base');

async function start() {
  const app = new Koa();

  const root = path.resolve(__dirname, DIST_PATH);

  app.use(
    static(root, {
      index: 'index.html',
      gzip: true,
    })
  );

  app.use(cors());

  const port = 8208;

  app.listen(port, () => {
    console.log(`serverURL: http://localhost:${port}`);
  });
}

start();