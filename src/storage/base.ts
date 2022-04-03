import localforage from 'localforage/src/localforage';
import { ee } from '@/third-party/event';

export const enum STORE_LEVEL {
  STORE = -1, // 比如名单，不在清除范围
  SAFE = 0, // 比如书架信息，书籍阅读位置记录，除非删除书籍的时候才会清除
  TEMP = 1, // 随便清理
}

const SAFE_KEY = 'book-story@safe';
const TEMP_KEY = 'book-story@temp';

let safeKey: Set<any>;
let tempKey: Set<any>;

(async () => {
  safeKey = new Set(await getItem(SAFE_KEY)) ?? new Set();
  tempKey = new Set(await getItem(TEMP_KEY)) ?? new Set();
})();

setTimeout(() => {
  ee.on('app-state', (isActive: boolean) => {
    if (!isActive) {
      setItem(SAFE_KEY, safeKey, STORE_LEVEL.STORE);
      setItem(TEMP_KEY, tempKey, STORE_LEVEL.STORE);
    }
  });
}, 4000);

export async function getItem(key: string): Promise<any> {
  const value = await localforage.getItem(key);
  if (value != null) return value;
  return null;
}

export async function setItem(key: string, value: any, level?: STORE_LEVEL) {
  if (level === STORE_LEVEL.SAFE) {
    safeKey.add(key);
  } else if (level !== STORE_LEVEL.STORE) {
    tempKey.add(key);
  }

  await localforage.setItem(key, value);
}

export async function removeItem(key: string) {
  await localforage.removeItem(key);
}

export async function clearTemp() {
  const workArr: any[] = [];
  tempKey.forEach(key => workArr.push(removeItem(key)));
  await Promise.all(workArr);
  tempKey.clear();
}

export async function clearAll() {
  await localforage.clear();
  safeKey.clear();
  tempKey.clear();
}
