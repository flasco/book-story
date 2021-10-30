import { setItem, getItem, STORE_LEVEL } from './base';
import { IChapter, IContent, IBook } from '@/definition';

type bookType = 'books' | 'flattens';
export function getBooksWithType(type: bookType): Promise<IBook[]> {
  const key = 'book-story@' + type;

  return getItem(key);
}

export function setBooksWithType(type: bookType, books: IBook[]) {
  const key = 'book-story@' + type;

  return setItem(key, books, STORE_LEVEL.STORE);
}

export function getChapterList(sourceUrl: string): Promise<IChapter[]> {
  const key = 'list@' + sourceUrl;

  return getItem(key);
}

export function updateChapterList(sourceUrl: string, list: IChapter[]) {
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

export function updateBookRecord(sourceUrl: string, record: IRecord) {
  const key = 'record@' + sourceUrl;
  return setItem(key, record, STORE_LEVEL.SAFE);
}

export async function getBookChapters(sourceUrl: string): Promise<Map<string, IContent>> {
  const key = 'chapter@' + sourceUrl;

  const result = await getItem(key);
  if (result == null) return new Map();
  // 如果不是array，说明是老的使用object存储的方式，需要转一下
  if (!Array.isArray(result)) {
    return new Map(Object.entries(result));
  }
  return new Map(result);
}

export function updateBookChapters(sourceUrl: string, chapter: Map<string, IContent>) {
  const key = 'chapter@' + sourceUrl;
  if (sourceUrl == null) return;
  return setItem(key, [...chapter]);
}
