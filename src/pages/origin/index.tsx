import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Container from '@/layout/container';
import TouchableHighlight from '@/components/touchable';
import CustomBadge from '@/components/custom-badge';
import { closeLoading, openLoading, spliceLine, toastFail } from '@/utils';
import { useBook } from '@/hooks/use-book';

import { getOriginLatest } from './api';

import styles from './index.module.scss';

const OriginPage = () => {
  const { currentBook: bookInfo, api } = useBook();
  const origins = bookInfo?.source;
  const { goBack } = useHistory();

  const currentCatalog = bookInfo?.catalogUrl;
  const [originList, setOriginList] = useState<any[]>([]);

  useEffect(() => {
    if (!origins) toastFail({ text: '书籍信息读取失败，请返回书架重试' });
    else {
      openLoading('数据请求中');
      getOriginLatest(origins)
        .then(val => {
          setOriginList(val);
          closeLoading();
        })
        .catch(() => toastFail({ text: '请求失败，请稍后重试' }));
    }
  }, []);

  const onClick = item => {
    const isSuccess = api.changeOrigin(item);
    if (!isSuccess) toastFail({ text: '不在书架中，换源失败' });
    else goBack();
  };

  return (
    <Container showBar title="换源" className={styles.container} back>
      {originList.map((i, index) => {
        const siteName = new URL(i.catalogUrl).hostname;
        const isSelected = currentCatalog === i.catalogUrl;
        return (
          <TouchableHighlight key={index} onClick={() => onClick(i)} className={styles.item}>
            <div className={styles.first}>
              <span className={styles.title}>{siteName}</span>
              {isSelected && <CustomBadge text="当前选择" />}
            </div>
            <div className={styles['sub-title']}>
              {spliceLine(i.latestChapter ?? '获取失败', 23)}
            </div>
          </TouchableHighlight>
        );
      })}
    </Container>
  );
};

export default OriginPage;
