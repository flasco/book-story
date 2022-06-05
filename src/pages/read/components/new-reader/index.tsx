import React, { useMemo } from 'react';

import { animated } from '@react-spring/web';

import { useReaderContext } from '../../context';
import useDrag from '../../hook/use-drag';

import styles from './index.module.scss';

const NewReader: React.FC = () => {
  const { title, pages, watched, api, hasMultiPage, canBackToLast } = useReaderContext();
  const param = useMemo(
    () => ({
      hasMultiPage,
      canBackToLast,
      initialPage: watched,
      saveRecord: api.saveRecord,
      hookLeft: api.prevChapter,
      hookRight: api.nextChapter,
      hookCenter: api.changeMenu,
    }),
    [watched, api]
  );

  const { innerRef, outerRef, page, loading, total, transformX } = useDrag(pages, param);

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
          <div className={styles.inner} ref={outerRef}>
            <animated.div
              ref={innerRef}
              className={styles.main}
              style={{ transform: transformX.to(x => `translateX(${x}px)`) }}
            >
              {pagesElement}
            </animated.div>
          </div>
        </div>
        {footer}
      </div>
    </>
  );
};

export default NewReader;
