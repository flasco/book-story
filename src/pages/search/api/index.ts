import { get, post } from '@/utils/request';

export function search(name: string, author = '') {
  return get('/v2/sear', {
    name,
    aut: author,
  });
}

export function newSearch(keyword: string) {
  return post('/v2/new-search', {
    keyword,
  });
}

export function getSites() {
  return get('/v2/site-map');
}
