import { get } from '@/utils/request';

export function search(name: string, author = '') {
  return get('/v2/sear', {
    name,
    aut: author,
  });
}
