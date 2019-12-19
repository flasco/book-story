import React, { useState } from 'react';

import { screenWidth } from '@/constants';

import throttle from 'lodash/throttle';

import styles from './index.m.scss';

let startX = 0;

const pageWidth = screenWidth - 16;

const Content: React.FC<{ pages: string[] }> = ({ pages }) => {
  const ref = React.createRef<HTMLDivElement>();
  const [page, setPage] = useState(0);

  // useEffect(() => {
  //   console.log(ref.current?.scrollWidth);
  // }, []);

  const onDown = e => {
    startX = e.touches[0].clientX;
  };

  const onMove = throttle(e => {
    const prevX = e.touches?.[0].clientX - startX;

    requestAnimationFrame(() => {
      ref.current && (ref.current.style.transform = `translateX(-${page * pageWidth - prevX}px)`);
    });
  }, 30);

  const onEnd = e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 20) {
      const currentPage = diff < 0 ? page + 1 : page - 1;
      setPage(currentPage);
    }
  };

  const handleMove = e => {
    e.persist();
    onMove(e);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div
          className={styles.main}
          ref={ref}
          onTouchStart={onDown}
          onTouchMove={handleMove}
          onTouchEnd={onEnd}
          style={{ transform: `translateX(-${page * pageWidth}px)` }}
        >
          {pages.map((i: string, ind: number) => (
            <p key={'' + ind}>{i}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
