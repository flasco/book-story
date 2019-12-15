import React from 'react';
import cx from 'classnames';

import styles from './index.m.scss';

interface IContainerProps {
  className?: string;
}

const Container: React.FC<IContainerProps> = ({ children = null, className }) => {
  return <div className={cx(styles.box, className)}>{children}</div>;
};

export default Container;
