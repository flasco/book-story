import React, { useMemo } from 'react';

import { useReaderContext } from '../../context';
import useDrag from '../../hook/use-drag';

import styles from './index.m.scss';

const NewReader: React.FC = () => {
  const { title, pages, watched, api } = useReaderContext();
  const param = useMemo(
    () => ({
      initialPage: watched,
      saveRecord: api.saveRecord,
      hookLeft: api.prevChapter,
      hookRight: api.nextChapter,
      hookCenter: api.changeMenu,
    }),
    [watched, api]
  );

  const { ref, page, touchEvent, loading, total } = useDrag(pages, param);

  const footer = useMemo(() => {
    if (total < 1) return null;
    return <div className={styles.footer}>{`${page + 1}/${total}`}</div>;
  }, [total, page]);

  const pagesElement = useMemo(
    () => pages.map((i: string, ind: number) => <p key={'' + ind}>{i}</p>),
    [pages]
  );

  return (
    <>
      {loading && <div className={styles.mask} />}
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.wrapper}>
          <div className={styles.inner} {...touchEvent}>
            <div ref={ref} className={styles.main}>
              {pagesElement}
            </div>
          </div>
        </div>
        {footer}
      </div>
    </>
  );
};

export default NewReader;
