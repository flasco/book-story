import { setItem, getItem, STORE_LEVEL } from './base';
import { IChapter, IContent, IBook } from '@/defination';

type bookType = 'books' | 'flattens';
export async function getBooksWithType(type: bookType): Promise<IBook[]> {
  const key = 'book-story@' + type;

  return getItem(key);
}

export async function setBooksWithType(type: bookType, books: IBook[]) {
  const key = 'book-story@' + type;

  return setItem(key, books, STORE_LEVEL.STORE);
}

export async function getChapterList(sourceUrl: string): Promise<IChapter[]> {
  const key = 'list@' + sourceUrl;

  return getItem(key);
}

export async function updateChapterList(sourceUrl: string, list: IChapter[]) {
  const key = 'list@' + sourceUrl;
  return setItem(key, list, STORE_LEVEL.TEMP);
}

interface IRecord {
  recordChapterNum: number;
  recordPage: number;
}

export async function getBookRecord(sourceUrl: string): Promise<IRecord> {
  const key = 'record@' + sourceUrl;

  return (await getItem(key)) ?? { recordChapterNum: 0, recordPage: 1 };
}

export async function updateBookRecord(sourceUrl: string, record: IRecord) {
  const key = 'record@' + sourceUrl;
  return setItem(key, record, STORE_LEVEL.SAFE);
}

export async function getBookChapters(sourceUrl: string): Promise<{ [url: string]: IContent }> {
  const key = 'chapter@' + sourceUrl;

  const result = await getItem(key);
  if (result == null || Array.isArray(result)) return {};
  return result;
}

export async function updateBookChapters(sourceUrl: string, chapter: { [url: string]: IContent }) {
  const key = 'chapter@' + sourceUrl;
  return setItem(key, chapter);
}
