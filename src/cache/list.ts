import { getChapterList, updateChapterList } from '@/storage/book';
import { IChapter } from '@/definition';

class ListCache {
  key: string;
  list: IChapter[] = [];
  constructor(key: string) {
    this.key = key;
  }

  checkIsExist = async () => {
    const list = await getChapterList(this.key);
    if (list != null) {
      this.list = list;
    }
    return list?.length > 0;
  };

  updateList = (list: IChapter[]) => {
    this.list = list;
    updateChapterList(this.key, list);
  };

  getChapterUrl = (position: number) => this.list[position]?.url ?? '';

  getChapterName = (position: number) => this.list[position]?.title ?? '';

  getLength = () => this.list.length;

  cleanListCache = () => {
    this.list = [];
    updateChapterList(this.key, []);
  };

  findChapterPosition = (url: string) => this.list.findIndex(i => i.url === url);
}

export default ListCache;
