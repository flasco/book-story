import { get } from '@/utils/request';

export function getChapter(url: string) {
  return get('/v2/analysis', {
    action: 2,
    url,
  });
}
