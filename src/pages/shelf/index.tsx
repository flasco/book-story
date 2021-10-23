import React, { useEffect, useMemo } from 'react';
import { MoreOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';

import { appName } from '@/constants';
import Container from '@/layout/container';
import { useDrawer } from '@/components/drawer';

import Drawer from './components/drawer';
import BookList from './components/book-list';

import { useNoticed } from './use-noticed';

import styles from './index.module.scss';

const RightIcon = ({ onClick }) => (
  <div onClick={onClick}>
    <MoreOutline color="#fff" style={{ fontSize: 24 }} />
  </div>
);

let pusher = 0;

// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  const opener = useDrawer();
  const { push } = useHistory();
  const right = useMemo(() => <RightIcon onClick={opener.changeVisible} />, [opener]);

  useNoticed();

  useEffect(() => {
    // hack: 修复 safari 的 bug
    // safari 的 bug：history 层级为 2 的时候，goBack 无效
    if (pusher === 0) {
      pusher += 1;
      push('/');
    }
  }, [push]);

  return (
    <Container showBar title={appName} className={styles.container} topRight={right}>
      <Drawer opener={opener}>
        <BookList />
      </Drawer>
    </Container>
  );
};

export default Shelf;
