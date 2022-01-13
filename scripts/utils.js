export const generateVersion = (generLen = 6) => {
  const strs = 'ABCDEFTUGHJTOKYabcdefghigklmnopqrstuvwxyz0123456789';
  let ver = '';
  for (let i = 0; i < generLen; i++) {
    ver += strs[(Math.random() * strs.length) | 0];
  }
  console.log('version generated -', ver);
  return ver;
};
