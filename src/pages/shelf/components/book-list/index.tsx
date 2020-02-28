import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ListView, PullToRefresh, Toast, SwipeAction } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { useBook } from '@/hooks/use-book';

import ImageShow from '@/components/image-show';
import Touchable from '@/components/touchable';
import { spliceLine } from '@/utils';
import { IBook } from '@/defination';

import styles from './index.m.scss';

const PullRefresh: any = PullToRefresh;

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

let isInit = false;

const BookList = () => {
  const {
    books,
    api: { updateLists, clickBookToRead, sortBookWithStamp, deleteBook },
  } = useBook();
  const { push } = useHistory();
  const [pull, setPull] = useState(true);
  const datasets = useMemo(() => ds.cloneWithRows(books), [books]);

  const flag = books.length > 0 ? true : isInit ? true : false;
  useEffect(() => {
    if (books.length > 0) {
      if (isInit) return;
      isInit = true;
      onPull(true);
    }
  }, [flag]);

  const onPull = useCallback(
    async (slience = false) => {
      setPull(true);
      if (books.length > 0) {
        const { cnt, flattened } = await updateLists();
        !slience && Toast.info(`更新完毕，${cnt} 本有更新，养肥区 ${flattened} 本待看`);
      }
      setPull(false);
    },
    [setPull, books, updateLists]
  );

  const refresh = useMemo(() => <PullRefresh refreshing={pull} onRefresh={onPull} />, [pull]);

  const renderItem = (item: IBook, _, index: any) => {
    const { bookName, author, plantformId, img, isUpdate } = item;
    const onClick = () => {
      push('/read', item);
      clickBookToRead(+index);
      sortBookWithStamp();
    };
    return (
      <SwipeAction
        key={`${bookName}-${author}-${plantformId}`}
        style={{ background: 'var(--shelf-row)' }}
        autoClose
        right={[
          // {
          //   text: '养肥',
          //   onPress: () => console.log('cancel'),
          //   style: { color: 'black' },
          // },
          {
            text: '详情',
            onPress: () => push('/detail', item),
            style: { color: '#000' },
          },
          {
            text: '删除',
            onPress: () => deleteBook(+index),
            style: { color: '#F4333C' },
          },
        ]}
      >
        <Touchable className={styles.item} onClick={onClick}>
          <ImageShow src={img} className={styles.img} />
          <div className={styles.info}>
            <div className={styles.first}>
              <div className={styles.title}>{bookName}</div>
              {isUpdate && <CustomBadge text="更新" />}
            </div>
            <div className={styles.sub}>{getSubTitle(item)}</div>
          </div>
        </Touchable>
      </SwipeAction>
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
