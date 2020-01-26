import React, { useMemo, useEffect, useCallback } from 'react';
import { FixedSizeList as ListView } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import cx from 'classnames';

// import TouchableHighlight from '@/components/touchable';

import { useReaderContext } from '@/pages/read/context';

import styles from './index.m.scss';
import TouchableHighlight from '@/components/touchable';

const BookList = ({ changeOpen, open, changeMenu }) => {
  const {
    cache: { list, record },
    api: { goToChapter },
  } = useReaderContext();
  const listx = React.useRef<any>(null);

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
    <AutoSizer>
      {({ height, width }) => (
        <ListView
          ref={listx}
          className="needScroll"
          height={height - 44}
          itemData={data}
          itemSize={35}
          width={width}
          overscanCount={4}
          itemCount={data.length}
        >
          {renderItem}
        </ListView>
      )}
    </AutoSizer>
  );
};

export default BookList;
