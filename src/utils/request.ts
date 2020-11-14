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

export async function get<T = any>(url: string, payload?: TObject, retryCnt = 0): Promise<T> {
  url = transformURL(getIp() + url, payload);
  for (let i = 0; i <= retryCnt; i++) {
    try {
      const {
        data: { data, code, msg },
      } = await axios.get(url, {
        cancelToken: getSource(),
      });

      if (code !== 0 && code !== 200) throw msg;
      return data;
    } catch (error) {
      await delay(2000);
      console.log(`请求失败，第${i + 1}次重试...`);
    }
  }
  throw '请求失败';
}

export async function getAsBuffer(url: string, payload?: TObject) {
  url = transformURL(getIp() + url, payload);
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
    cancelToken: getSource(),
  });

  return data;
}

export async function post<T = any>(url: string, payload?: TObject) {
  url = getIp() + url;

  try {
    const {
      data: { data, code, msg },
    } = await axios.post(url, payload, {
      cancelToken: getSource(),
    });
    if (code !== 0 && code !== 200) throw msg;
    return data as T;
  } catch (error) {
    throw error.message || error;
  }
}
