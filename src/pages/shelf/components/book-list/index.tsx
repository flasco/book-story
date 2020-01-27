import React, { useMemo } from 'react';
import { ListView } from 'antd-mobile';
import { useBook } from '@/hooks/use-book';

import renderItem from './render-item';

import styles from './index.m.scss';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

const renderSeparator = (_, id) => {
  return <div className={styles.separator} key={id} />;
};

const BookList = () => {
  const { books } = useBook();
  const datasets = useMemo(() => ds.cloneWithRows(books), []);

  return (
    <ListView
      dataSource={datasets}
      renderRow={renderItem}
      renderSeparator={renderSeparator}
      initialListSize={10}
      pageSize={10}
      className={styles.list}
      // pullToRefresh={PullToRefresh}
    />
  );
};

export default BookList;
