import { useRef, useMemo, useEffect, useCallback } from 'react';
import cx from 'classnames';

import TouchableHighlight from '@/components/touchable';
import VirtualList from '@/components/virtual-list';

import { useReaderContext } from '@/pages/read/context';

import styles from './index.m.scss';

const BookList = ({ changeOpen, open, changeMenu }) => {
  const {
    cache: { list, record },
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
    changeOpen();
    changeMenu();
    goToChapter(index, 1);
  }, []);

  const renderItem = useCallback(
    ({ index, data, style }) => {
      const click = () => onClick(index);
      return (
        <TouchableHighlight style={style} className={styles.item} onClick={click}>
          <span className={cx({ [styles.current]: index === currentPos })}>
            {data[index].title}
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
