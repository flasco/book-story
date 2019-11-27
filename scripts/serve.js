const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const static = require('koa-static');

async function start() {
  const app = new Koa();

  const root = path.resolve(__dirname, '../dist');

  app.use(
    static(root, {
      index: 'index.html'
    })
  );

  app.use(cors());

  const port = 8208;

  app.listen(port, () => {
    console.log(`serverURL: http://localhost:${port}`);
  });
}

start();