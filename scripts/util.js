const fs = require('fs');
const path = require('path');
const ora = require('ora');
const webpack = require('webpack');
const dllConfig = require('../config/webpack.dll');
const { DIST_PATH } = require('../config/base');
/**
 * @param {string} filePath asd
 */
function fileExists(filePath) {
  return new Promise((resolve) => {
    fs.exists(filePath, (existFlag) => {
      resolve(existFlag);
    });
  });
}

exports.checkManifest = () => {
  const filePath = path.resolve(
    __dirname,
    `${DIST_PATH}/vendor-manifest.json`
  );
  return fileExists(filePath);
};

exports.dllComplier = () => {
  return new Promise((resolve) => {
    const spinnerDll = ora('compiling dll...').start();
    webpack(dllConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(err);
        console.error(stats.toString());
        spinnerDll.fail();
        process.exit(1);
      }
      // 成功执行完构建
      spinnerDll.succeed();
      resolve(true);
    });
  });
};
