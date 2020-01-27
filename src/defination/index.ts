export interface IBookX {
  /** 书名 */
  bookName: string;
  /** 作者 */
  author: string;
  /** 图片 */
  img: string;
  /** 描述 */
  desc: string;
  /** 选中的源 */
  plantformId: number;
  /** 源 */
  source: { [plantformId: string]: string };
}

interface IBookOperator {
  /** 最新章节名 */
  latestChapter: string;
  /** 最近阅读的时间戳，排序用 */
  latestRead: number;
  /** 是否有更新 */
  isUpdate: boolean;
  /** 更新的章节数 */
  updateNum: number;
}

export type IBook = IBookX & IBookOperator;

export interface IChapter {
  title: string;
  url: string;
}

export interface IContent {
  title: string;
  content: string;
}
