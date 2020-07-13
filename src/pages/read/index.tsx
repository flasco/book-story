import React from 'react';

import Container from '@/layout/container';

import Provider from './context';

import NavBlock from './components/nav-block';
import NewReader from './components/new-reader';

import styles from './index.m.scss';

const Home = props => {
  const catalogUrl = props?.location?.state?.catalogUrl ?? null;

  return (
    <Container className={styles.container}>
      <Provider catalogUrl={catalogUrl}>
        <NavBlock />
        <NewReader />
      </Provider>
    </Container>
  );
};

export default Home;
