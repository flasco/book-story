import { getItem, setItem, STORE_LEVEL } from '@/storage/base';
import { Dialog } from 'antd-mobile-v5';
import { useState, useEffect, useRef } from 'react';

const newVersionNoticedKey = 'new-version-noticed';

/** 大版本变动提示 */
export const useNoticed = () => {
  const [isLoaded, setLoaded] = useState(false);
  const isNoticed = useRef(false);

  useEffect(() => {
    if (isLoaded && !isNoticed.current) {
      Dialog.confirm({
        title: '警告',
        content:
          '当前版本的服务器经过大规模重构，提升了性能与后续的维护效率，但是可能会引入不可预知的bug，若遇到问题，请及时反馈~',
        confirmText: '我知道了',
        onConfirm: () => {
          setItem(newVersionNoticedKey, true, STORE_LEVEL.STORE);
          isNoticed.current = true;
        },
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    getItem(newVersionNoticedKey).then(val => {
      isNoticed.current = Boolean(val);
      setLoaded(true);
    });
  }, []);
};
