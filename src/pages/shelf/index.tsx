import React, { useEffect, useMemo } from 'react';
import { Icon } from 'antd-mobile';

import { appName } from '@/constants';
import Container from '@/layout/container';
import useSwitch from '@/hooks/use-switch';

import Drawer from './components/drawer';
import BookList from './components/book-list';

import styles from './index.module.scss';
import { useHistory } from 'react-router-dom';

const RightIcon = ({ onClick }) => (
  <div onClick={onClick}>
    <Icon type="ellipsis" size="md" color="#fff" />
  </div>
);

let pusher = 0;

// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  const [open, changeOpen] = useSwitch();
  const { push } = useHistory();
  const right = useMemo(() => <RightIcon onClick={changeOpen} />, [changeOpen]);

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
      <Drawer open={open} changeOpen={changeOpen}>
        <BookList />
      </Drawer>
    </Container>
  );
};

export default Shelf;
