import { getItem, setItem, STORE_LEVEL } from '@/storage/base';

export async function getSearchSetting(): Promise<string[]> {
  return (await getItem('book-story@search-setting')) ?? [];
}

export function setSearchSetting(value) {
  setItem('book-story@search-setting', value, STORE_LEVEL.SAFE);
}
