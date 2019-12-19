import React from 'react';

import styles from './index.m.scss';

const Footer = ({ page, total }) => {
  return (
    <div className={styles.footer}>
      {page}/{total}
    </div>
  );
};

export default Footer;
