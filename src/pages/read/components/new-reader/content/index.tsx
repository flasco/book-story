import React, { useState } from 'react';

import { screenWidth } from '@/constants';

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
    const current = ref.current as HTMLDivElement;

    requestAnimationFrame(() => {
      current.style.transition = 'transform 50ms ease 0s';
    });
  };

  const onMove = e => {
    const prevX = e.touches?.[0].clientX - startX;
    const current = ref.current as HTMLDivElement;

    requestAnimationFrame(() => {
      current.style.transform = `translateX(-${page * pageWidth - prevX}px)`;
    });
  };

  const onEnd = e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 20) {
      const currentPage = diff < 0 ? page + 1 : page - 1;
      setPage(currentPage);
      const current = ref.current as HTMLDivElement;
      if (ref.current == null) return;
      requestAnimationFrame(() => {
        current.style.transition = 'transform 150ms ease 0s';
        current.style.transform = `translateX(-${currentPage * pageWidth}px)`;
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div
          className={styles.main}
          ref={ref}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
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
