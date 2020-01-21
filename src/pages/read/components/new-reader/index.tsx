import React, { useMemo } from 'react';

import { useReaderContext } from '../../context';
import useDrag from '../../hook/use-drag';

import styles from './index.m.scss';

const NewReader: React.FC = () => {
  const { title, pages, watched, nextChapter, prevChapter } = useReaderContext();
  const { ref, page, touchEvent, total } = useDrag(pages, {
    initPage: watched,
    nextChapter,
    prevChapter,
  });

  const footer = useMemo(() => {
    if (total < 1) return null;
    return (
      <div className={styles.footer}>
        {page + 1}/{total}
      </div>
    );
  }, [total, page]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
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
    </div>
  );
};

export default NewReader;
