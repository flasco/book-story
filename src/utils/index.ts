import { Toast } from 'antd-mobile';
import React from 'react';

export function openLoading(text?: string) {
  Toast.loading(text, 0);
}

interface IParams {
  text: string;
  sec?: number;
  callback?: () => void;
}

export function toastFail(param: IParams) {
  const { text, sec = 2, callback } = param;
  Toast.fail(text, sec, callback, false);
}

export function closeLoading() {
  Toast.hide();
}

export function spliceLine(str: string, count = 15) {
  return (str?.length ?? 0) > count ? str.substr(0, count) + '...' : str;
}

export function buffer2Base64(buffer: any) {
  return (
    'data:image/png;base64,' +
    btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
  );
}

export function formatObj2Str(obj: TObject) {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
}

export function transformURL(url: string, obj?: TObject) {
  return url + (obj != null ? '?' + formatObj2Str(obj as any) : '');
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const connectContext = (child: any, ...providers) => {
  return props =>
    providers.reduce(
      (prev, cur) => React.createElement(cur, { children: prev }),
      React.createElement(child, props)
    );
};
