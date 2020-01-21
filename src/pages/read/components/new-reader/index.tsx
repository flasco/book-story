import React from 'react';

import Content from './content';
import Title from './title';

import styles from './index.m.scss';
import { useReaderContext } from '../../context';

const NewReader: React.FC = () => {
  const { title } = useReaderContext();
  return (
    <div className={styles.container}>
      <Title name={title} />
      <Content />
    </div>
  );
};

export default NewReader;
