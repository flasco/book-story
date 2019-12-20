import React, { useState, useEffect } from 'react';

import { screenWidth } from '@/constants';

import Footer from '../footer';

import styles from './index.m.scss';

let startX = 0;

const pageWidth = screenWidth - 16;

interface IContentProps {
  initPage?: number;
  pages: string[];
}

const Content: React.FC<IContentProps> = ({ pages, initPage = 4 }) => {
  const ref = React.createRef<HTMLDivElement>();
  const [page, setPage] = useState(initPage - 1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (pages.length > 0) {
      const totalWidth = ref.current?.scrollWidth as number;
      const totalPage = (totalWidth + 16) / pageWidth;
      setTotal(totalPage);
    }
  }, [pages]);

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
    const current = ref.current as HTMLDivElement;

    let currentPage = page;
    if (Math.abs(diff) > 20) {
      currentPage = diff < 0 ? page + 1 : page - 1;
      setPage(currentPage);
    }
    requestAnimationFrame(() => {
      current.style.transition = 'transform 150ms ease 0s';
      current.style.transform = `translateX(-${currentPage * pageWidth}px)`;
    });
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onEnd}>
          <div
            className={styles.main}
            ref={ref}
            style={{ transform: `translateX(-${page * pageWidth}px)` }}
          >
            {pages.map((i: string, ind: number) => (
              <p key={'' + ind}>{i}</p>
            ))}
          </div>
        </div>
      </div>
      <Footer page={page + 1} total={total} />
    </>
  );
};

export default Content;
