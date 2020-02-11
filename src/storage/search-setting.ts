import { getItem, setItem, STORE_LEVEL } from '@/storage/base';

export function getSearchSetting(): string[] {
  return getItem('book-story@search-setting') ?? [];
}

export function setSearchSetting(value) {
  setItem('book-story@search-setting', value, STORE_LEVEL.SAFE);
}
