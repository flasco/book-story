import { post } from '@/utils/request';

export function getOriginLatest(list: string[]) {
  return post('/v2/analysis/origin', { list });
}
