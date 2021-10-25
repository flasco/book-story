import { useState, useEffect, useMemo } from 'react';
import { Slider } from 'antd-mobile-v5';
import { SliderValue } from 'antd-mobile-v5/es/components/slider';
import { LeftOutline, RightOutline } from 'antd-mobile-icons';

import styles from './index.module.scss';
import { useReaderContext } from '@/pages/read/context';

const getPercent = (pos, total) => ((pos / total) * 100).toFixed(1) + '%';

const ProgressBlock = () => {
  const {
    title,
    api: { nextChapter, prevChapter, goToChapter },
    cache,
  } = useReaderContext();
  const { list, record } = cache;
  const [curTitle, setCurTitle] = useState(title);
  const [position, setPosition] = useState(() => record.getChapterPosition() + 1);
  const total = useMemo(() => list.getLength(), [cache]);

  useEffect(() => {
    setCurTitle(title);
    setPosition(record.getChapterPosition() + 1);
  }, [title, cache]);

  const changeSlider = (pos: SliderValue) => {
    if (typeof pos !== 'number') return;
    const name = list.getChapterName(pos - 1);
    setCurTitle(name);
    setPosition(pos);
  };

  const afterChangeSlider = (pos: SliderValue) => {
    if (typeof pos !== 'number') return;
    goToChapter(pos - 1, 1);
  };

  const percent = useMemo(() => getPercent(position, total), [position, cache]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.cbtn} onClick={prevChapter}>
          <LeftOutline />
          上一章
        </div>
        <div className={styles.chapter}>
          <p className={styles.ell}>{curTitle}</p>
          <p className={styles.percent}>{percent}</p>
        </div>
        <div className={styles.cbtn} onClick={nextChapter}>
          下一章
          <RightOutline />
        </div>
      </div>
      <div>
        <Slider
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
