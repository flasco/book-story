import React, { useState, useCallback } from 'react';

import cx from 'classnames';

import styles from './index.m.scss';

const LONG_PRESS_DURATION = 600;

interface IProps {
  onClick?: any;
  onLongPress?: any;
  children?: any;
  className?: any;
}

const TouchableHighlight: React.FC<IProps> = ({
  onClick = null,
  onLongPress = null,
  children = null,
  className = '',
}) => {
  const [timeStamp, setStamp] = useState(0);
  const [timer, setTimer] = useState();

  const onStart = useCallback(() => {
    setStamp(Date.now());
    if (onLongPress != null) {
      setTimer(setTimeout(() => onLongPress(), LONG_PRESS_DURATION));
    }
  }, []);

  const onEnd = useCallback(() => {
    const now = Date.now() - timeStamp;
    if (now < LONG_PRESS_DURATION) {
      clearTimeout(timer);
      onClick && onClick();
    }
  }, [timeStamp, timer]);

  return (
    <div className={cx(styles.box, className)} onTouchStart={onStart} onTouchEnd={onEnd}>
      {children}
    </div>
  );
};

export default TouchableHighlight;
