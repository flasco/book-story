import { post } from '@/utils/request';

/** 书源竞争，判断使用的书源优先级 */
export async function getDetail(sources: string[]) {
  return post<any[]>('/v3/books/api/infos', sources);
}
