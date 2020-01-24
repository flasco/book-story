import { ee } from '@/main';

export enum STORE_LEVEL {
  STORE = -1, // 比如名单，不在清除范围
  SAFE = 0, // 比如书架信息，书籍阅读位置记录，除非删除书籍的时候才会清除
  TEMP = 1, // 随便清理
}

const SAFE_KEY = 'book-story@safe';
const TEMP_KEY = 'book-story@temp';

const safeKey: Set<any> = new Set(getItem(SAFE_KEY)) ?? new Set();
const tempKey: Set<any> = new Set(getItem(TEMP_KEY)) ?? new Set();

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
    safeKey.add(key);
  } else if (level !== STORE_LEVEL.STORE) {
    tempKey.add(key);
  }

  const payload = { content: value };
  localStorage.setItem(
    key,
    JSON.stringify(payload, (_, value) => (value instanceof Set ? [...value] : value))
  );
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
}

export function clearTemp() {
  tempKey.forEach(key => removeItem(key));
  tempKey.clear();
}

export function clearAll() {
  localStorage.clear();
  safeKey.clear();
  tempKey.clear();
}
