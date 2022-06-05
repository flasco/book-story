import { useMemo } from 'react';
import { MoreOutline } from 'antd-mobile-icons';

import { appName } from '@/constants';
import Container from '@/layout/container';
import { useDrawer } from '@/components/drawer';

import Drawer from './components/drawer';
import BookList from './components/book-list';

import styles from './index.module.scss';

const RightIcon = ({ onClick }: any) => (
  <div onClick={onClick}>
    <MoreOutline color="#fff" style={{ fontSize: 24 }} />
  </div>
);

// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  const opener = useDrawer();
  const right = useMemo(() => <RightIcon onClick={opener.changeVisible} />, [opener]);

  return (
    <Container showBar title={appName} className={styles.container} topRight={right}>
      <Drawer opener={opener}>
        <BookList />
      </Drawer>
    </Container>
  );
};

export default Shelf;
