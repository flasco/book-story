import { getChapterList, updateChapterList } from '@/storage/book';
import { IChapter } from '@/definition';

class ListCache {
  key: string;
  list: IChapter[] = [];
  constructor(key) {
    this.key = key;
  }

  checkIsExist = async () => {
    const list = await getChapterList(this.key);
    if (list != null) this.list = list;
    return list?.length > 0;
  };

  updateList = list => {
    this.list = list;
    updateChapterList(this.key, list);
  };

  getListChapterItem = position => this.list[position];

  getChapterUrl = position => this.getListChapterItem(position)?.url ?? '';

  getChapterName = position => this.getListChapterItem(position)?.title ?? '';

  getLength = () => this.list.length;

  cleanListCache = () => {
    this.list = [];
    updateChapterList(this.key, []);
  };

  findChapterPosition = url => {
    return this.list.findIndex(i => i.url === url);
  };
}

export default ListCache;
