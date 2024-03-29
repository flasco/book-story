import { get, post } from '@/utils/request';
import { IChapter } from '@/definition';

export function getLatestChapter(url: string, retryCnt = 0) {
  return get(
    '/v3/analyze/api/latest-chapter',
    {
      url,
    },
    { retryCnt }
  );
}

interface IFetchItem {
  title: string;
  url: string;
  catalogUrl?: string;
}

interface IFetchRET {
  title: string;
  list: IChapter[];
}

export function fetchAllLatest(list: IFetchItem[]) {
  if (list.length < 1) {
    return [];
  }
  return post<(IFetchRET | null)[]>('/v3/analyze/api/batch-latest-chapters', list);
}
