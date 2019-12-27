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
