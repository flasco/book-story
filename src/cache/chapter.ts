import { IContent } from '@/defination';
import { getBookChapters, updateBookChapters } from '@/storage/book';
import { getChapter } from '@/pages/read/api';
import { newGetP } from '@/utils/text';

class ChapterCache {
  key: string;
  chapters: Map<string, IContent> = new Map();

  constructor(key: string) {
    this.key = key;
    this.init();
  }

  init = async () => {
    this.chapters = await getBookChapters(this.key);
  };

  hasChapter = (chapterUrl: string): boolean => {
    return this.chapters.has(chapterUrl);
  };

  getContent = async (chapterUrl: string, retryCnt = 0): Promise<IContent> => {
    try {
      const cached = this.chapters.get(chapterUrl);
      if (cached == null) {
        const chapter = await getChapter(chapterUrl, retryCnt);
        if (chapter.content.length > 0) {
          if (newGetP(chapter.content)[0] === '获取失败') throw '获取失败';
          this.chapters.set(chapterUrl, chapter);
        }
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
