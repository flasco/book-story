import axios from 'axios';

import { getIp } from '@/config';
import { transformURL } from '@/utils';

axios.defaults.timeout = 15000; // 设置超时时间为 15s

export async function get<T = any>(url: string, payload?: object): Promise<T> {
  url = transformURL(getIp() + url, payload);
  const {
    err,
    data: { data, code, msg },
  } = await axios.get(url);

  if (err) throw err.message || err;
  if (code !== 0 && code !== 200) throw msg;
  return data;
}

export async function getAsBuffer(url: string, payload?: object) {
  url = transformURL(getIp() + url, payload);
  const { err, data } = await axios.get(url, { responseType: 'arraybuffer' });

  if (err) throw err.message || err;
  return data;
}

export async function post(url: string, payload?: object) {
  url = getIp() + url;

  const {
    err,
    data: { data, code, msg },
  } = await axios.post(url, payload);
  if (err) throw err.message || err;
  if (code !== 0 && code !== 200) throw msg;
  return data;
}
