import React from 'react';
import TouchableHighlight from '@/components/touchable';
import ImageShow from '@/components/image-show';

import { IBook } from '@/defination';
import { spliceLine } from '@/utils';

import styles from './index.m.scss';

const CustomBadge = ({ text }) => {
  return <div className={styles['list-badge']}>{text}</div>;
};

const getSubTitle = item => {
  if (item.updateNum > 10) return `距上次点击已更新${item.updateNum}章`;
  return spliceLine(item.latestChapter, 15);
};

const Item = ({ item }) => {
  return (
    <TouchableHighlight className={styles.item}>
      <ImageShow src={item.img} className={styles.img} />
      <div className={styles.info}>
        <div className={styles.first}>
          <div className={styles.title}>{item.bookName}</div>
          <CustomBadge text="更新" />
        </div>
        <div className={styles.sub}>{getSubTitle(item)}</div>
      </div>
    </TouchableHighlight>
  );
};

const renderItem = (item: IBook) => <Item item={item} />;

export default renderItem;
