const isDev = process.env.PROJECT_ENV === 'development';

const serverIps = [
  'https://cmdsh3b7eebg.cn-e1.leanapp.cn',
  'https://mhbxymrllauo.cn-e1.leanapp.cn',
];

export const getIp = (() => {
  let prevIp;
  let lockTime = Date.now();

  return () => {
    if (isDev) return 'http://localhost:3001';
    const current = Date.now();
    if (prevIp == null || current - lockTime > 3600 * 1000) {
      const currenthours = new Date().getHours();
      const curPoi = currenthours >= 9 && currenthours < 22 ? 0 : 1;
      prevIp = serverIps[curPoi];
      lockTime = current;
    }
    return prevIp;
  };
})();
