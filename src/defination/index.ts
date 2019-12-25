interface IBookBase {
  /** 书名 */
  bookName: string;
  /** 作者 */
  author: string;
  /** 图片 */
  img: string;
  /** 描述 */
  desc: string;
  /** 最新章节名 */
  latestChapter: string;
}

interface IBookOperator {
  /** 选中的源 */
  plantformId: number;
  /** 最后阅读的章节 */
  latestRead: number;
  /** 是否有更新 */
  isUpdate: boolean;
  /** 更新的章节数 */
  updateNum: number;
  /** 最近阅读的时间戳，排序用 */
  latestStamp: number;
  /** 源 */
  source: {
    [key: string]: string;
  };
}

export type IBook = IBookBase & IBookOperator;
