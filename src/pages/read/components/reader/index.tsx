import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Carousel } from 'antd-mobile';

import { LeftBoundary, RightBoundary, screenHeight } from '@/constants';

import styles from './index.m.scss';

const Comp = Carousel as any;

let startPoint: number[] = [];
let endPoint: number[] = [];

const contentHeight = screenHeight - 40;

const PageRender = ({ title, page, total, current }) => {
  return (
    <div className={styles.container} style={{ height: contentHeight }}>
      <div className={styles.title}>{title}</div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: page.join('<br />') }}
      />
      <div className={styles.footer}>
        {current}/{total}
      </div>
    </div>
  );
};

interface IReaderProps {
  pages: string[][];
  title?: string;
  initialPage?: number;
}

const Reader: React.FC<IReaderProps> = props => {
  const { pages = [], title = '', initialPage = 1 } = props;
  const pageSize = pages.length;

  const [cur, setCur] = useState(initialPage - 1);

  // 不出意外应该还有问题，到时候再看
  useEffect(() => {
    if (pageSize < 1) return;
    setCur((initialPage > pageSize ? pageSize : initialPage) - 1);
  }, [pageSize > 0]);

  const goNext = () => {
    if (cur < pageSize - 1) setCur(cur + 1);
  };

  const goPrev = () => {
    if (cur > 0) setCur(cur - 1);
  };

  if (pageSize === 0) return null;

  return (
    <div
      className={cx(styles.light)}
      style={{ height: screenHeight, overflow: 'hidden' }}
      onTouchStart={e => {
        // console.log('start', e.touches[0].clientX, e.touches[0].clientY);
        startPoint = [e.touches[0].clientX, e.touches[0].clientY];
      }}
      onTouchEnd={e => {
        // console.log('end', e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        endPoint = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

        const movedX = Math.abs(startPoint[0] - endPoint[0]);
        const clickX = startPoint[0];
        if (movedX < 10) {
          e.preventDefault();
          if (clickX > LeftBoundary && clickX < RightBoundary) {
            console.log('open menu');
          } else if (clickX < LeftBoundary) {
            goPrev();
          } else if (clickX > RightBoundary) {
            goNext();
          }
        }
      }}
    >
      <Comp
        className={cx(styles.light)}
        dots={false}
        speed={100}
        selectedIndex={cur}
        afterChange={to => setCur(to)}
      >
        {pages.map((page: any, ind: number) => (
          <PageRender
            key={`pages-${ind}`}
            title={title}
            page={page}
            current={ind + 1}
            total={pageSize}
          />
        ))}
      </Comp>
    </div>
  );
};

export default Reader;
