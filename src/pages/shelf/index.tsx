import React, { useMemo } from 'react';
import { Icon } from 'antd-mobile';

import { appName } from '@/constants';
import Container from '@/layout/container';
import useSwitch from '@/hooks/use-switch';

import Drawer from './components/drawer';
import BookList from './components/book-list';

import styles from './index.m.scss';

const RightIcon = ({ onClick }) => (
  <div onClick={onClick}>
    <Icon type="ellipsis" size="md" color="#fff" />
  </div>
);

// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  const [open, changeOpen] = useSwitch();
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
