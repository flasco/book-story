import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ListView, PullToRefresh, Toast } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { useBook } from '@/hooks/use-book';

import ImageShow from '@/components/image-show';
import Touchable from '@/components/touchable';
import { spliceLine } from '@/utils';
import { IBook } from '@/defination';

import styles from './index.m.scss';

const PullRefresh: any = PullToRefresh;

let isFirstLoad = true;

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

const renderSeparator = (_, id) => {
  return <div className={styles.separator} key={id} />;
};

const CustomBadge = ({ text }) => {
  return <div className={styles['list-badge']}>{text}</div>;
};

const getSubTitle = item => {
  if (item.updateNum > 10) return `距上次点击已更新${item.updateNum}章`;
  return spliceLine(item.latestChapter, 15);
};

const BookList = () => {
  const {
    books,
    api: { updateLists, clickBookToRead, sortBookWithStamp },
  } = useBook();
  const { push } = useHistory();
  const [pull, setPull] = useState(false);
  const datasets = useMemo(() => ds.cloneWithRows(books), []);

  useEffect(() => {
    if (isFirstLoad) {
      onPull();
      isFirstLoad = false;
    }
  }, []);

  const onPull = useCallback(async () => {
    setPull(true);
    const { cnt, flattened } = await updateLists();
    setPull(false);
    Toast.info(`更新完毕，${cnt} 本有更新，养肥区 ${flattened} 本待看`);
  }, [setPull]);

  const refresh = useMemo(() => <PullRefresh refreshing={pull} onRefresh={onPull} />, [pull]);

  const renderItem = (item: IBook, _, index: any) => {
    const { bookName, author, plantformId, img, isUpdate } = item;
    const onClick = () => {
      push('/read', item);
      clickBookToRead(+index);
      setTimeout(() => sortBookWithStamp(), 600);
    };
    return (
      <Touchable
        key={`${bookName}-${author}-${plantformId}`}
        className={styles.item}
        onClick={onClick}
      >
        <ImageShow src={img} className={styles.img} />
        <div className={styles.info}>
          <div className={styles.first}>
            <div className={styles.title}>{bookName}</div>
            {isUpdate && <CustomBadge text="更新" />}
          </div>
          <div className={styles.sub}>{getSubTitle(item)}</div>
        </div>
      </Touchable>
    );
  };

  return (
    <ListView
      dataSource={datasets}
      renderRow={renderItem}
      renderSeparator={renderSeparator}
      initialListSize={10}
      pageSize={10}
      className={cx(styles.list, 'needScroll')}
      pullToRefresh={refresh}
    />
  );
};

export default BookList;
