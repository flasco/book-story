import React from 'react';

import Container from '@/layout/container';

import NewReader from './components/new-reader';
import useReader from './hook/use-reader';

import styles from './index.m.scss';

const Home = props => {
  const bookInfo = props?.location?.state ?? null;
  const { title, pages, watched } = useReader(bookInfo);

  return (
    <Container className={styles.container}>
      <NewReader pages={pages} title={title} initPage={watched} />
    </Container>
  );
};

export default Home;
