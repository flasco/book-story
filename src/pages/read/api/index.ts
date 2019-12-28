import { get } from '@/utils/request';
import { IChapter, IContent } from '@/defination';

export function getChapter(url: string) {
  return get<IContent>('/v2/analysis', {
    action: 2,
    url,
  });
}

export function getList(url: string) {
  return get<IChapter[]>('/v2/analysis', {
    action: 1,
    url,
  });
}
