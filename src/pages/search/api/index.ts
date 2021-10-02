import { get } from '@/utils/request';

export function newSearch(keyword: string) {
  return get('/v3/books/api/search', {
    keyword,
  });
}

export function getSites() {
  return get('/v3/others/api/site-map');
}
