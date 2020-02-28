import { Toast } from 'antd-mobile';

export function openLoading(text?: string) {
  Toast.loading(text, 0);
}

export function closeLoading() {
  Toast.hide();
}

export function spliceLine(str: string, count: number) {
  return str?.length ?? 0 > count ? str.substr(0, count) + '...' : str;
}

export function buffer2Base64(buffer: any) {
  return (
    'data:image/png;base64,' +
    btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
  );
}

export function formatObj2Str(obj: object) {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
}

export function transformURL(url: string, obj?: object) {
  return url + (obj != null ? '?' + formatObj2Str(obj as any) : '');
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
