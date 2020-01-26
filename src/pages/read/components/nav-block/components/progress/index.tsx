import React, { useState, useEffect, useMemo } from 'react';
import { Icon, Slider } from 'antd-mobile';

import styles from './index.m.scss';
import { useReaderContext } from '@/pages/read/context';

const Slder: any = Slider;

const getPercent = (pos, total) => ((pos / total) * 100).toFixed(1) + '%';

const ProgressBlock = () => {
  const {
    title,
    api: { nextChapter, prevChapter, goToChapter },
    cache,
  } = useReaderContext();
  const { list, record } = cache;
  const [curTitle, setCurTitle] = useState(title);
  const [position, setPosition] = useState(record.getChapterPosition() + 1);
  const total = useMemo(() => list.getLength(), [cache]);

  useEffect(() => {
    setCurTitle(title);
    setPosition(record.getChapterPosition() + 1);
  }, [title, cache]);

  const changeSlider = (pos: number) => {
    const name = list.getChapterName(pos - 1);
    setCurTitle(name);
    setPosition(pos);
  };

  const afterChangeSlider = (pos: number) => {
    goToChapter(pos - 1, 1);
  };

  const percent = useMemo(() => getPercent(position, total), [position, cache]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.cbtn} onClick={prevChapter}>
          <Icon type="left" />
          上一章
        </div>
        <div className={styles.chapter}>
          <p className={styles.ell}>{curTitle}</p>
          <p className={styles.percent}>{percent}</p>
        </div>
        <div className={styles.cbtn} onClick={nextChapter}>
          下一章
          <Icon type="right" />
        </div>
      </div>
      <div>
        <Slder
          style={{ marginLeft: 22, marginRight: 22, marginTop: 20 }}
          trackStyle={{
            backgroundColor: 'red',
          }}
          handleStyle={{ background: 'red', border: 0, width: 16, height: 16, marginTop: -7 }}
          value={position}
          min={1}
          max={total}
          onChange={changeSlider}
          onAfterChange={afterChangeSlider}
        />
      </div>
    </div>
  );
};

export default ProgressBlock;
