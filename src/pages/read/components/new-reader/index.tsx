import React, { useMemo, useRef } from 'react';

import { useReaderContext } from '../../context';
import useDrag from '../../hook/use-drag';

import styles from './index.m.scss';

const NewReader: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

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

  const { page, loading, total } = useDrag(pages, ref, param);

  const footer = useMemo(() => {
    if (total < 1) return null;
    return <div className={styles.footer}>{`${page + 1}/${total}`}</div>;
  }, [total, page]);

  return (
    <>
      {loading && <div className={styles.mask} />}
      <div ref={ref} className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            <div className={styles.main}>
              {pages.map((i: string, ind: number) => (
                <p key={'asd_x' + ind}>{i}</p>
              ))}
            </div>
          </div>
        </div>
        {footer}
      </div>
    </>
  );
};

export default NewReader;
