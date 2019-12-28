import { ee } from '@/main';

export enum STORE_LEVEL {
  STORE = -1, // 比如名单，不在清除范围
  SAFE = 0, // 比如书架信息，书籍阅读位置记录，除非删除书籍的时候才会清除
  TEMP = 1, // 随便清理
}

const SAFE_KEY = 'book-story@safe';
const TEMP_KEY = 'book-story@temp';

const safeKey: string[] = getItem(SAFE_KEY) ?? [];
const tempKey: string[] = getItem(TEMP_KEY) ?? [];

setTimeout(() => {
  ee.on('app-state', (isActive: boolean) => {
    if (!isActive) {
      setItem(SAFE_KEY, safeKey, STORE_LEVEL.STORE);
      setItem(TEMP_KEY, tempKey, STORE_LEVEL.STORE);
    }
  });
}, 4000);

export function getItem(key: string) {
  const value = localStorage.getItem(key);
  if (value != null) return JSON.parse(value).content;
  return null;
}

export function setItem(key: string, value: any, level?: STORE_LEVEL) {
  if (level === STORE_LEVEL.SAFE) {
    safeKey.push(key);
  } else if (level !== STORE_LEVEL.STORE) {
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
  tempKey.length = 0;
}

export function clearAll() {
  localStorage.clear();
  safeKey.length = 0;
  tempKey.length = 0;
}
