import { get } from '@/utils/request';

export function getChapter() {
  return get('/v2/analysis', {
    action: 2,
    url: 'http://www.xs.la/34_34495/2266828.html',
  });
}
