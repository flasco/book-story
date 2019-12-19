import React from 'react';

import styles from './index.m.scss';

const NewReader = ({ pages }) => {
  return (
    <div className={styles.container}>
      <div>123</div>
      <div className={styles.box2}>
        <div className={styles.box}>
          <div className={styles.main}>
            {pages.map((i, ind) => (
              <p key={'' + ind}>{i}</p>
            ))}
          </div>
        </div>
      </div>
      <div>123354</div>
    </div>
  );
};

export default NewReader;
