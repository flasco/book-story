import { post } from '@/utils/request';

export function getOriginLatest(list: string[]) {
  return post('/v3/analyze/api/origin', list);
}
