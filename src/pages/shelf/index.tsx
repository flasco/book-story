import React from 'react';
import { Link } from 'react-router-dom';

import Container from '@/layout/container';
import { appName } from '@/constants';

import styles from './index.m.scss';
// import { useBook } from '@/hooks/use-book';
import { Button } from 'antd-mobile';
import { useTheme } from '@/hooks/use-theme';

// 边栏的抽屉用 antd-mobile 的 Drawer
// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  // const { flattens, api, books } = useBook();
  const { changeSunny } = useTheme();

  const clickx = () => {
    changeSunny();
  };

  return (
    <Container className={styles.container} title={appName} showBar>
      <Link to={'/read'}>测试</Link>
      <Button onClick={clickx}>12312</Button>
    </Container>
  );
};

export default Shelf;
