import { get } from '@/utils/request';
import { IChapter, IContent } from '@/definition';

export function getChapter(url: string, retryCnt = 0) {
  return get<IContent>(
    '/v3/analyze/api/chapter',
    {
      url,
    },
    { retryCnt, cache: true }
  );
}

export function getList(url: string) {
  return get<IChapter[]>('/v3/analyze/api/catalog', {
    url,
  });
}
