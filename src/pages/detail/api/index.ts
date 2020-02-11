import { get } from '@/utils/request';

export async function getDetail(url: string) {
  return get('/v2/analysis/info', { url });
}
