import { getChapterList, updateChapterList } from '@/storage/book';
import { IChapter } from '@/defination';

class ListCache {
  key: string;
  list: IChapter[] = [];
  constructor(key) {
    this.key = key;
  }

  checkIsExist = () => {
    const list = getChapterList(this.key);
    if (list != null) this.list = list;
    return list != null;
  };

  updateList = list => {
    this.list = list;
    updateChapterList(this.key, list);
  };

  getChapterUrl = position => {
    return this.list[position]?.url || '';
  };

  getLength = () => this.list.length;

  findChapterPosition = url => {
    return this.list.findIndex(i => i.url === url);
  };
}

export default ListCache;
