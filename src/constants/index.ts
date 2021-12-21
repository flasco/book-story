export const screenWidth = window.innerWidth;
export const screenHeight = window.innerHeight;

export const leftBoundary = screenWidth / 4;
export const rightBoundary = screenWidth - leftBoundary;

export const appName = '书 · 事';

export const FLATTEN_BLOCK = {
  bookName: '养肥区',
  author: 'admin',
  img: '-1',
  desc: '书籍变肥的地方~',
  latestChapter: '待检测',
  plantformId: 1,
  latestRead: -1,
  isUpdate: false,
  updateNum: 0,
  source: {
    '1': '',
    '2': '',
  },
};

export const enum ICON_FONT_MAP {
  SEARCH = '\ue7b3',
  MOON = '\ue773',
  SUN = '\ue771',
  ELLIPSIS = '\ue74f',
  CONDITION = '\ue748',
  CATALOG = '\ue747',
  PROGRESS = '\ue609',
}
