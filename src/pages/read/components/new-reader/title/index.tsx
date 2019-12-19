import React from 'react';

import styles from './index.m.scss';

const Title = ({ name }) => {
  return <div className={styles.title}>{name}</div>;
};

export default Title;
