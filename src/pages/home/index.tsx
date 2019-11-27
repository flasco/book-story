import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd-mobile';
import cx from 'classnames';

import styles from './index.m.scss';
import { getChapter } from './api';
import getPageArr from '@/utils/text';

let startPoint: number[] = [];
let endPoint: number[] = [];

const screenWidth = screen.availWidth;
const LeftBoundary = screenWidth / 4;
const RightBoundary = screenWidth - LeftBoundary;

const Home = () => {
  const [pages, setPages] = useState<string[][]>([[]]);
  const [title, setTitle] = useState<string>('');
  const [cur, setCur] = useState(0);

  const pageSize = pages.length;

  useEffect(() => {
    getChapter().then(val => {
      setTitle(val.title);
      const pageArr = getPageArr(val.content);
      setPages(pageArr);
    });
  }, []);

  const goNext = () => {
    if (cur < pageSize - 1) setCur(cur + 1);
  };

  const goPrev = () => {
    if (cur > 0) setCur(cur - 1);
  };

  return (
    <div
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
        swipeSpeed={24}
        selectedIndex={cur}
        afterChange={to => setCur(to)}
      >
        {pages.map((page, ind) => (
          <div
            key={`pages-${ind}`}
            className={styles.container}
            style={{ height: screen.availHeight - 40 }}
          >
            <div className={styles.title}>{title}</div>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: page.join('<br />') }}
            />
            <div className={styles.footer}>
              {ind + 1}/{pages.length}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
