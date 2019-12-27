import { Toast } from 'antd-mobile';

export function openLoading(text?: string) {
  Toast.loading(text, 0);
}

export function closeLoading() {
  Toast.hide();
}

export function spliceLine(str: string, count: number) {
  return str.length > count ? str.substr(0, count) + '...' : str;
}

export function buffer2Base64(buffer: any) {
  return (
    'data:image/png;base64,' +
    btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
  );
}
