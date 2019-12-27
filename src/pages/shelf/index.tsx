import React, { useMemo, useState, useCallback } from 'react';

import Container from '@/layout/container';
import { appName } from '@/constants';

import styles from './index.m.scss';
// import { useBook } from '@/hooks/use-book';
import { Drawer, Icon } from 'antd-mobile';

const SiderBar = () => {
  return <div className={styles.sider}>123</div>;
};

const useDrawer = () => {
  const [open, setOpen] = useState(false);

  const changeOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);
  return [open, changeOpen] as [boolean, () => void];
};

const RightIcon = ({ onClick }) => (
  <div onClick={onClick}>
    <Icon type="ellipsis" size="md" color="#fff" />
  </div>
);

// 如果进入阅读页，会有个修改最近阅读时间戳的操作，这个时候会导致reflow?
const Shelf = () => {
  // const { flattens, api, books } = useBook();
  const [open, changeOpen] = useDrawer();

  const siderBar = useMemo(SiderBar, []);

  return (
    <Container
      className={styles.container}
      title={appName}
      showBar
      topRight={<RightIcon onClick={changeOpen} />}
    >
      <Drawer
        className={styles.box}
        sidebar={siderBar}
        position="right"
        open={open}
        contentStyle={{ height: '100%' }}
        onOpenChange={changeOpen}
      >
        hello
      </Drawer>
    </Container>
  );
};

export default Shelf;
