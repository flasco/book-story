import { ee } from '@/main';

export enum STORE_LEVEL {
  SAFE = 0, // 比如书架信息，书籍阅读位置记录，除非删除书籍的时候才会清除
  TEMP = 1, // 随便清理
}

const safeKey: string[] = getItem('book-story@safe') ?? [];
const tempKey: string[] = getItem('book-story@temp') ?? [];

ee.on('app-state', (isActive: boolean) => {
  if (!isActive) {
    setItem('book-story@safe', safeKey);
    setItem('book-story@temp', tempKey);
  }
});

export function getItem(key: string) {
  const value = localStorage.getItem(key);
  if (value != null) return JSON.parse(value).content;
  return null;
}

export function setItem(key: string, value: any, level?: STORE_LEVEL) {
  if (level === STORE_LEVEL.SAFE) {
    safeKey.push(key);
  } else {
    tempKey.push(key);
  }
  const payload = { content: value };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
}

export function clearTemp() {
  tempKey.forEach(key => removeItem(key));
}

export function clearAll() {
  localStorage.clear();
}
