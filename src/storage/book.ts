import { setItem, getItem, STORE_LEVEL } from './base';
import { IChapter, IContent } from '@/defination';

export function getChapterList(sourceUrl: string) {
  const key = 'list@' + sourceUrl;

  return getItem(key) as IChapter[];
}

export function updateChapterList(sourceUrl: string, list: IChapter[]) {
  const key = 'list@' + sourceUrl;
  return setItem(key, list, STORE_LEVEL.TEMP);
}

interface IRecord {
  recordChapterNum: number;
  recordPage: number;
}

export function getBookRecord(sourceUrl: string): IRecord {
  const key = 'record@' + sourceUrl;

  return getItem(key) ?? { recordChapterNum: 0, recordPage: 1 };
}

export function updateBookRecord(sourceUrl: string, record: IRecord) {
  const key = 'record@' + sourceUrl;
  return setItem(key, record, STORE_LEVEL.SAFE);
}

export function getBookChapters(sourceUrl: string): { [url: string]: IContent } {
  const key = 'chapter@' + sourceUrl;

  const result = getItem(key);
  if (result == null || Array.isArray(result)) return {};
  return result;
}

export function updateBookChapters(sourceUrl: string, chapter: { [url: string]: IContent }) {
  const key = 'chapter@' + sourceUrl;
  return setItem(key, chapter);
}
