import { Toast } from 'antd-mobile';

export function openLoading(text?: string) {
  Toast.loading(text, 0);
}

export function closeLoading() {
  Toast.hide();
}
