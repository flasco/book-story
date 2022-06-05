import axios from 'axios';

import { getIp } from '@/config';
import { transformURL, delay } from '@/utils';

axios.defaults.timeout = 12000; // 设置超时时间为 8s

const getSource = (timeout = 12000) => {
  const source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, timeout);
  return source.token;
};

interface IOptions {
  retryCnt?: number;
  cache?: boolean;
  timeout?: number;
}

const requestCache = new Map<string, Promise<any>>();

/** 支持缓存，避免重复请求，特别针对 prefetch 场景下 */
export function get<T = any>(url: string, payload?: Record<string, any>, options?: IOptions): Promise<T> {
  const { cache = false, ...others } = options ?? {};
  url = transformURL(getIp() + url, payload);

  if (!cache) return _get(url, others);

  let request = requestCache.get(url);
  if (!request) {
    request = _get(url, others).finally(() => requestCache.delete(url));
    requestCache.set(url, request);
  }

  return request;
}

// eslint-disable-next-line no-underscore-dangle
export async function _get<T = any>(url: string, options: Omit<IOptions, 'cache'>): Promise<T> {
  const { retryCnt = 0, timeout } = options;
  for (let i = 0; i <= retryCnt; i++) {
    try {
      const {
        data: { data, code, msg },
      } = await axios.get(url, {
        cancelToken: getSource(timeout),
      });

      if (code !== 0 && code !== 200) throw msg;
      return data;
    } catch (_error) {
      await delay(2000);
      console.log(`请求失败，第${i + 1}次重试...`);
    }
  }
  throw new Error('请求失败');
}

export async function getAsBuffer(url: string, payload?: any) {
  url = transformURL(getIp() + url, payload);
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
    cancelToken: getSource(),
  });

  return data;
}

export async function post<T = any>(url: string, payload?: any) {
  url = getIp() + url;

  try {
    const {
      data: { data, code, msg },
    } = await axios.post(url, payload, {
      cancelToken: getSource(),
    });
    if (code !== 0 && code !== 200) throw msg;
    return data as T;
  } catch (error: any) {
    throw error.message || error;
  }
}
