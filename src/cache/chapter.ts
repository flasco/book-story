import { IContent } from '@/defination';
import { getBookChapters, updateBookChapters } from '@/storage/book';
import { getChapter } from '@/pages/read/api';

class ChapterCache {
  key: string;
  chapters: { [url: string]: IContent };

  constructor(key: string) {
    this.key = key;
    this.chapters = getBookChapters(key);
  }

  getContent = async (chapterUrl: string, retryCnt = 0): Promise<IContent> => {
    try {
      const cached = this.chapters[chapterUrl];
      if (cached == null) {
        const chapter = await getChapter(chapterUrl, retryCnt);
        this.chapters[chapterUrl] = chapter;
        return chapter;
      }
      return cached;
    } catch (error) {
      return { title: '网络异常', content: '网络异常，请稍后重试' };
    }
  };

  updateChapters = () => {
    updateBookChapters(this.key, this.chapters);
  };
}

export default ChapterCache;
