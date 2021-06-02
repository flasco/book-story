import React from 'react';
import styles from './index.module.scss';

const CustomBadge = ({ text, background = 'red', color = '#fff' }) => {
  return (
    <div className={styles.badge} style={{ backgroundColor: background, color }}>
      {text}
    </div>
  );
};

export default CustomBadge;
