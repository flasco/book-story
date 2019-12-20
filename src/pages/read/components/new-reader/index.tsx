import React from 'react';

import Content from './content';
import Title from './title';

import styles from './index.m.scss';

const NewReader = ({ pages }) => {
  return (
    <div className={styles.container}>
      <Title name={'第一章：诡异的世界'} />
      <Content pages={pages} />
    </div>
  );
};

export default NewReader;
