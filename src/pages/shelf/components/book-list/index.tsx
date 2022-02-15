import { useEffect } from 'react';
import { List, PullToRefresh, Toast, SwipeAction } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { useCallbackRef } from '@/hooks';
import { useBook } from '@/hooks/use-book';

import ImageShow from '@/components/image-show';
import Touchable from '@/components/touchable';
import CustomBadge from '@/components/custom-badge';
import { spliceLine } from '@/utils';
import { IBook } from '@/definition';

import styles from './index.module.scss';

const getSubTitle = item => {
  if (item.updateNum > 10) return `距上次点击已更新${item.updateNum}章`;
  return spliceLine(item.latestChapter, 15);
};

let isInit = false;

const BookList = () => {
  const { books, api } = useBook();
  const { updateLists, clickBookToRead, sortBookWithStamp, deleteBook } = api;
  const { push } = useHistory();

  const flag = books.length > 0 ? true : isInit ? true : false;

  const onPull = useCallbackRef(
    async (slience = false) => {
      if (books.length > 0) {
        const { cnt, flattened } = await updateLists();
        !slience && Toast.show(`更新完毕，${cnt} 本有更新，养肥区 ${flattened} 本待看`);
      }
    },
    [books]
  );

  useEffect(() => {
    if (books.length > 0) {
      if (isInit) return;
      isInit = true;
      onPull.current(true);
    }
  }, [flag, onPull]);

  const renderItem = (item: IBook, index: number) => {
    const { bookName, author, plantformId, img, isUpdate } = item;
    const onClick = () => {
      push('/read');
      clickBookToRead(+index);
      sortBookWithStamp();
    };
    return (
      <SwipeAction
        style={{ background: 'var(--shelf-row)', touchAction: 'pan-y' }}
        rightActions={[
          // {
          //   text: '养肥',
          //   onPress: () => console.log('cancel'),
          //   style: { color: 'black' },
          // },
          {
            text: '详情',
            key: 'detail',
            onClick: () => push('/detail', item),
            color: '#000',
          },
          {
            text: '删除',
            key: 'delete',
            onClick: () => deleteBook(+index),
            color: '#F4333C',
          },
        ]}
      >
        <Touchable
          key={`${bookName}-${author}-${plantformId}`}
          className={cx('needScroll', styles.item)}
          onClick={onClick}
        >
          <ImageShow src={img} className={styles.img} />
          <div className={styles.info}>
            <div className={styles.first}>
              <div className={styles.title}>{bookName}</div>
              {isUpdate && <CustomBadge text="更新" background="#e80000" />}
            </div>
            <div className={styles.sub}>{getSubTitle(item)}</div>
          </div>
        </Touchable>
      </SwipeAction>
    );
  };

  return (
    <div className={cx('needScroll', styles.container)}>
      <PullToRefresh onRefresh={() => onPull.current()}>
        <List className={styles.list}>
          {books.map((book, ind) => {
            return (
              <List.Item key={`${book.bookName}-${book.author}`}>{renderItem(book, ind)}</List.Item>
            );
          })}
        </List>
      </PullToRefresh>
    </div>
  );
};

export default BookList;
