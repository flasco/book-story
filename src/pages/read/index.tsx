import React from 'react';

import Container from '@/layout/container';

import Reader from './components/reader';
import useReader from './hook/use-reader';

import styles from './index.m.scss';

const Home = () => {
  const { title, pages } = useReader();

  return (
    <Container className={styles.container}>
      <Reader pages={pages} title={title} initialPage={5} />
    </Container>
  );
};

export default Home;
