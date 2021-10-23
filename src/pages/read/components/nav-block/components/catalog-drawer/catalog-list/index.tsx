import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import cx from 'classnames';

import TouchableHighlight from '@/components/touchable';
import VirtualList from '@/components/virtual-list';
import { useReaderContext } from '@/pages/read/context';
import { spliceLine } from '@/utils';

import styles from './index.module.scss';

const BookList = ({ opener, changeMenu }) => {
  const { open, changeVisible } = opener;
  const {
    cache: { list, record, chapters },
    api: { goToChapter },
  } = useReaderContext();
  const listx = useRef<any>(null);

  const data = useMemo(() => list.list, [list.list]);
  const currentPos = useMemo(() => record.getChapterPosition(), [record.getChapterPosition()]);

  useEffect(() => {
    if (open) {
      listx.current?.scrollToItem?.(currentPos + 10);
    }
  }, [open, currentPos]);

  const onClick = useCallback(index => {
    changeVisible();
    changeMenu();
    goToChapter(index, 1);
  }, []);

  const renderItem = useCallback(
    ({ index, data, style }) => {
      const click = () => onClick(index);
      const curData = data[index];
      return (
        <TouchableHighlight style={style} className={styles.item} onClick={click}>
          <span
            className={cx({
              [styles.cached]: chapters.hasChapter(curData.url),
              [styles.current]: index === currentPos,
            })}
          >
            {spliceLine(curData.title, 18)}
          </span>
        </TouchableHighlight>
      );
    },
    [currentPos]
  );

  return (
    <VirtualList ref={listx} data={data} itemSize={40} preLength={44} renderItem={renderItem} />
  );
};

export default BookList;
