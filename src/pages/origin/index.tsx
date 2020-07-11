import React, { useEffect, useState } from 'react';

import Container from '@/layout/container';
import TouchableHighlight from '@/components/touchable';
import CustomBadge from '@/components/custom-badge';
import { getOriginLatest } from './api';

import styles from './index.m.scss';
import { spliceLine } from '@/utils';
import { useHistory } from 'react-router-dom';

const OriginPage = props => {
  const bookInfo = props?.location?.state?.bookInfo ?? {};
  const origins = bookInfo.source;
  const { goBack } = useHistory();

  const currentCatalog = bookInfo.catalogUrl;
  const [originList, setOriginList] = useState<any[]>([]);
  useEffect(() => {
    getOriginLatest(origins).then(val => {
      setOriginList(val);
    });
  }, []);
  console.log(originList);

  const onClick = item => {
    console.log(item);
    goBack();
  };
  return (
    <Container showBar title="换源" className={styles.container} back>
      {originList.map((i, index) => {
        const isSelected = currentCatalog === i.catalogUrl;
        return (
          <TouchableHighlight key={index} onClick={() => onClick(i)} className={styles.item}>
            <div className={styles.first}>
              <span className={styles.title}>{i.siteName}</span>
              {isSelected && <CustomBadge text="当前选择" />}
            </div>
            <div className={styles['sub-title']}>{spliceLine(i.latestChapter, 23)}</div>
          </TouchableHighlight>
        );
      })}
    </Container>
  );
};

export default OriginPage;
