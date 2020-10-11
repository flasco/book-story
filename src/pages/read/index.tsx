import React from 'react';

import Container from '@/layout/container';
import { useBook } from '@/hooks/use-book';

import Provider from './context';

import NavBlock from './components/nav-block';
import NewReader from './components/new-reader';

import styles from './index.m.scss';

const Home = () => {
  const { currentBook } = useBook();
  const bookInfo = currentBook ?? null;

  return (
    <Container className={styles.container}>
      <Provider bookInfo={bookInfo}>
        <NavBlock />
        <NewReader />
      </Provider>
    </Container>
  );
};

export default Home;
