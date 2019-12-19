import React from 'react';

import Container from '@/layout/container';

// import Reader from './components/reader';
import useReader from './hook/use-reader';

import styles from './index.m.scss';
import NewReader from './components/new-reader';

const Home = () => {
  const { pages } = useReader();
  // console.log(pages);

  return (
    <Container className={styles.container}>
      <NewReader pages={pages} />
      {/* <Reader pages={pages} title={title} initialPage={5} /> */}
    </Container>
  );
};

export default Home;
