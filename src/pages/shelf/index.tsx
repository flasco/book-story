import React from 'react';
import { Link } from 'react-router-dom';

import Container from '@/layout/container';
import { appName } from '@/constants';

import styles from './index.m.scss';

// 边栏的抽屉用 antd-mobile 的 Drawer

const Shelf = () => {
  return (
    <Container className={styles.container} title={appName}>
      <Link to={'/read'}>测试</Link>
    </Container>
  );
};

export default Shelf;
