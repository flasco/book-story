import React from 'react';

import styles from './index.m.scss';

const ThemeWrapper: React.FC = ({ children }) => {
  return <div className={styles.sunny}>{children}</div>;
};

export default ThemeWrapper;
