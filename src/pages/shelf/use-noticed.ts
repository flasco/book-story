import { getItem, setItem, STORE_LEVEL } from '@/storage/base';
import { Modal } from 'antd-mobile';
import { useState, useEffect, useRef } from 'react';

const newVersionNoticedKey = 'new-version-noticed';

/** 大版本变动提示 */
export const useNoticed = () => {
  const [isLoaded, setLoaded] = useState(false);
  const isNoticed = useRef(false);

  useEffect(() => {
    if (isLoaded && !isNoticed.current) {
      Modal.alert(
        '警告',
        '当前版本的服务器经过大规模重构，提升了性能与后续的维护效率，但是可能会引入不可预知的bug，若遇到问题，请及时反馈~',
        [
          {
            text: '我知道了',
            onPress: () => {
              setItem(newVersionNoticedKey, true, STORE_LEVEL.STORE);
              isNoticed.current = true;
            },
          },
        ]
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    getItem(newVersionNoticedKey).then(val => {
      isNoticed.current = Boolean(val);
      setLoaded(true);
    });
  }, []);
};
