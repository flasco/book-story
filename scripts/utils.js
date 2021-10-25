import path from 'path';
import fse from 'fs-extra';

export const generateVersion = (generLen = 6) => {
  const strs = 'ABCDEFTUGHJTOKYabcdefghigklmnopqrstuvwxyz0123456789';
  let ver = '';
  for (let i = 0; i < generLen; i++) {
    ver += strs[(Math.random() * strs.length) | 0];
  }
  return ver;
};

export const generateAntdPreloadDeps = () => {
  const compPath = 'antd-mobile-v5/es/components';

  const curPath = path.resolve(path.resolve(), 'node_modules', compPath);

  return fse.readdirSync(curPath).map(name => `${compPath}/${name}`);
};
