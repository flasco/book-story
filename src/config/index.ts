const isDev = process.env.PROJECT_ENV === 'development';

const serverIps = ['https://tassel-1.avosapps.us', 'https://tassel-2.avosapps.us'];

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
