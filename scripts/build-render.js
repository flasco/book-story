const parseArgs = require('minimist');
const ora = require('ora');
const webpack = require('webpack');
const configProd = require('../config/webpack.prod');
const configDev = require('../config/webpack.dev');
const { checkManifest, dllComplier } = require('./util');

const argv = parseArgs(process.argv.splice(2), {
  boolean: ['re-dll', 'dev'],
});

async function start() {
  if (argv['re-dll'] || !await checkManifest()) {
    await dllComplier();
  }
  const spinner = ora('compiling app...').start();
  const config = argv.dev ? configDev : configProd;
  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      // 构建过程出错
      spinner.fail();
      console.log(err);
      console.log(stats.toString());
      process.exit(1);
    }
    spinner.succeed();
  });
}

start();
