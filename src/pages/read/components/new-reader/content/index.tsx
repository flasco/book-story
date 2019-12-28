import React, { useState, useEffect, useMemo } from 'react';

import { screenWidth } from '@/constants';

import useDrag from './hooks/use-drag';

import styles from './index.m.scss';

const pageWidth = screenWidth - 16;

export interface IContentProps {
  initPage?: number;
  pages: string[];
}

const Content: React.FC<IContentProps> = ({ pages, initPage = 1 }) => {
  const [total, setTotal] = useState(0);
  const { ref, page, touchEvent, goTo } = useDrag({ initPage, total });

  useEffect(() => {
    if (pages.length > 0) {
      const totalWidth = ref.current?.scrollWidth as number;
      const totalPage = (totalWidth + 16) / pageWidth;
      setTotal(totalPage);
    }
  }, [pages]);

  useEffect(() => {
    if (initPage > 1) goTo(initPage, false);
  }, [initPage]);

  const footer = useMemo(() => {
    if (total < 1) return null;
    return (
      <div className={styles.footer}>
        {page + 1}/{total}
      </div>
    );
  }, [total, page]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner} {...touchEvent}>
          <div ref={ref} className={styles.main}>
            {pages.map((i: string, ind: number) => (
              <p key={'asd_x' + ind}>{i}</p>
            ))}
          </div>
        </div>
      </div>
      {footer}
    </>
  );
};

export default Content;
