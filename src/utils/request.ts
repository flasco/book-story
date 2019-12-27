import axios from 'axios';
import { getIp } from '@/config';

axios.defaults.timeout = 15000; // 设置超时时间为 15s

function formatObj2Str(obj: object) {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
}

export async function get(url: string, payload?: object) {
  url = getIp() + url;
  if (payload != null) {
    url += `?${formatObj2Str(payload)}`;
  }
  const {
    err,
    data: { data, code, msg },
  } = await axios.get(url);

  if (err) throw err.message || err;
  if (code !== 0 && code !== 200) throw msg;
  return data;
}

export async function getAsBuffer(url: string, payload?: object) {
  url = getIp() + url;
  if (payload != null) {
    url += `?${formatObj2Str(payload)}`;
  }
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
