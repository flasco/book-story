import React, { useMemo } from 'react';

import { appName } from '@/constants';
import Container from '@/layout/container';
import useDrawer from '@/hooks/use-sider';

import Drawer from './components/drawer';
import BookList from './components/book-list';

import styles from './index.m.scss';
// import { useBook } from '@/hooks/use-book';
import { Icon } from 'antd-mobile';

const RightIcon = ({ onClick }) => (
  <div onClick={onClick}>
    <Icon type="ellipsis" size="md" color="#fff" />
  </div>
);

// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  // const { flattens, api, books } = useBook();
  const [open, changeOpen] = useDrawer();
  const right = useMemo(() => <RightIcon onClick={changeOpen} />, [changeOpen]);

  return (
    <Container showBar title={appName} className={styles.container} topRight={right}>
      <Drawer open={open} changeOpen={changeOpen}>
        <BookList />
      </Drawer>
    </Container>
  );
};

export default Shelf;
