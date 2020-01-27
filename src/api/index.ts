import { get } from '@/utils/request';

export function getLatestChapter(url: string, retryCnt = 0) {
  return get(
    '/v2/analysis',
    {
      action: 3,
      url,
    },
    retryCnt
  );
}
