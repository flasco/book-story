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
}

const TouchableHighlight: React.FC<IProps> = ({
  onClick = null,
  onLongPress = null,
  children = null,
  className = '',
  style = {},
}) => {
  const [timeStamp, setStamp] = useState(0);
  const [timer, setTimer] = useState();

  const onStart = useCallback(e => {
    e.preventDefault();
    setStamp(Date.now());
    if (onLongPress != null) {
      setTimer(setTimeout(() => onLongPress(), LONG_PRESS_DURATION));
    }
  }, []);

  const onEnd = useCallback(
    e => {
      e.preventDefault();
      const now = Date.now() - timeStamp;
      if (now < LONG_PRESS_DURATION) clearTimeout(timer);
      if (onClick != null && (now < LONG_PRESS_DURATION || onLongPress == null)) onClick();
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
