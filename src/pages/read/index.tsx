import React from 'react';

import Container from '@/layout/container';

import NewReader from './components/new-reader';
import useReader from './hook/use-reader';

import styles from './index.m.scss';

const Home = () => {
  const { pages } = useReader();
  // console.log(pages);

  return (
    <Container className={styles.container}>
      <NewReader pages={pages} />
    </Container>
  );
};

export default Home;
