import { post } from '@/utils/request';

export async function getDetail(sources: string[]) {
  return post<any[]>('/v2/analysis/infos', { sources });
}
