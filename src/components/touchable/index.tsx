import React, { useState, useCallback } from 'react';

import cx from 'classnames';

import styles from './index.m.scss';

const LONG_PRESS_DURATION = 600;

interface IProps {
  onClick?: any;
  onLongPress?: any;
  children?: any;
  className?: any;
  style?: any;
  needStop?: boolean;
}

let startX = 0;
let startY = 0;

const TouchableHighlight: React.FC<IProps> = ({
  onClick = null,
  onLongPress = null,
  children = null,
  className = '',
  style = {},
  needStop = false,
}) => {
  const [timeStamp, setStamp] = useState(0);
  const [timer, setTimer] = useState(null as any);

  const onStart = useCallback(e => {
    needStop && e.preventDefault();
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    setStamp(Date.now());
    if (onLongPress != null) {
      setTimer(setTimeout(() => onLongPress(), LONG_PRESS_DURATION));
    }
  }, []);

  const onEnd = useCallback(
    e => {
      needStop && e.preventDefault();
      const { clientX: endX, clientY: endY } = e.changedTouches[0];
      if (Math.abs(startX - endX) < 4 && Math.abs(startY - endY) < 4) {
        const now = Date.now() - timeStamp;
        if (now < LONG_PRESS_DURATION) clearTimeout(timer);
        if (onClick != null && (now < LONG_PRESS_DURATION || onLongPress == null)) onClick();
      }
    },
    [timeStamp, timer]
  );

  return (
    <div
      style={style}
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      className={cx(styles.box, className)}
    >
      {children}
    </div>
  );
};

export default TouchableHighlight;
