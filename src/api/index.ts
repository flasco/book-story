import { get, post } from '@/utils/request';
import { IChapter } from '@/defination';

export function getLatestChapter(url: string, retryCnt = 0) {
  return get(
    '/v2/analysis',
    {
      action: 3,
      url,
    },
    { retryCnt }
  );
}

interface IFetchItem {
  title: string;
  url: string;
}

interface IFetchRET {
  title: string;
  list: IChapter[];
}
export function fetchAllLatest(list: IFetchItem[]) {
  if (list.length < 1) return [];
  return post<(IFetchRET & '-1')[]>('/v2/analysis', list);
}
