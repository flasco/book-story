import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import Container from '@/layout/container';
import TouchableHighlight from '@/components/touchable';
import CustomBadge from '@/components/custom-badge';
import { closeLoading, openLoading, spliceLine } from '@/utils';
import { useBook } from '@/hooks/use-book';

import { getOriginLatest } from './api';

import styles from './index.m.scss';

const OriginPage = () => {
  const { currentBook: bookInfo, api } = useBook();
  const origins = bookInfo?.source;
  const { goBack } = useHistory();

  const currentCatalog = bookInfo?.catalogUrl;
  const [originList, setOriginList] = useState<any[]>([]);

  useEffect(() => {
    if (!origins) Toast.fail('书籍信息读取失败，请返回书架重试', 2, undefined, false);
    else {
      openLoading('数据请求中');
      getOriginLatest(origins)
        .then(val => {
          setOriginList(val);
          closeLoading();
        })
        .catch(() => Toast.fail('请求失败，请稍后重试', 2, undefined, false));
    }
  }, []);

  const onClick = item => {
    api.changeOrigin(item);
    goBack();
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
