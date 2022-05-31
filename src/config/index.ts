import env from 'penv.macro';

const serverIps = env(
  {
    production: [
      'https://tassel-1.avosapps.us',
      'https://tassel-2.avosapps.us',
      // 'https://cmdsh3b7eebg.cn-e1.leanapp.cn',
      // 'https://mhbxymrllauo.cn-e1.leanapp.cn',
    ],
  },
  ['http://localhost:3001', 'http://localhost:3001']
);

export const getIp = (() => {
  let prevIp;
  let lockTime = Date.now();

  return () => {
    const current = Date.now();
    if (prevIp == null || current - lockTime > 3600 * 1000) {
      const currentHours = new Date().getUTCHours() + 8;
      const curPoi = currentHours >= 9 && currentHours < 22 ? 0 : 1;
      prevIp = serverIps[curPoi];
      lockTime = current;
    }
    return prevIp;
  };
})();
