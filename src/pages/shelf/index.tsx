import React from 'react';
import { Link } from 'react-router-dom';

import Container from '@/layout/container';

import styles from './index.m.scss';

const Shelf = () => {
  return (
    <Container className={styles.container}>
      <Link to={'/read'}>测试</Link>
    </Container>
  );
};

export default Shelf;
