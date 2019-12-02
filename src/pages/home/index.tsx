import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd-mobile';
import cx from 'classnames';

import styles from './index.m.scss';
import { getChapter } from './api';
import getPageArr from '@/utils/text';

import { screenWidth, LeftBoundary, RightBoundary, screenHeight } from '@/constants';

let startPoint: number[] = [];
let endPoint: number[] = [];

const fontSize = 22;
const lineHeight = 32;
const contentLeft = Math.floor(((screenWidth - 40) % fontSize) / 4);
const contentHeight = screenHeight - 40;

const PageRender = ({ title, page, total, current }) => {
  return (
    <div
      className={styles.container}
      style={{ height: contentHeight }}
    >
      <div className={styles.title}>{title}</div>
      <div
        className={styles.content}
        style={{ paddingLeft: contentLeft }}
        dangerouslySetInnerHTML={{ __html: page.join('<br />') }}
      />
      <div className={styles.footer}>
        {current}/{total}
      </div>
    </div>
  );
};

const Home = () => {
  const [pages, setPages] = useState<string[][]>([[]]);
  const [title, setTitle] = useState<string>('');
  const [cur, setCur] = useState(0);

  const pageSize = pages.length;

  useEffect(() => {
    getChapter().then(val => {
      setTitle(val.title);
      const pageArr = getPageArr(val.content, { fontSize, lineHeight });
      console.log(pageArr);
      setPages(pageArr);
    });
  }, []);

  const goNext = () => {
    if (cur < pageSize - 1) setCur(cur + 1);
  };

  const goPrev = () => {
    if (cur > 0) setCur(cur - 1);
  };

  // if (pages[0].length < 1) return null;
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
      <Carousel
        className={cx(styles.light)}
        dots={false}
        selectedIndex={cur}
        afterChange={to => setCur(to)}
      >
        {pages.map((page, ind) => (
          <PageRender
            key={`pages-${ind}`}
            title={title}
            page={page}
            current={ind + 1}
            total={pageSize}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
