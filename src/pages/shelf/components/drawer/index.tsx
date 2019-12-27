import React, { useMemo } from 'react';
import { Drawer } from 'antd-mobile';

import styles from './index.m.scss';

const SiderBar = () => {
  return <div className={styles.sider}>123</div>;
};

interface IProps {
  open: boolean;
  changeOpen: () => void;
}

const Sider: React.FC<IProps> = ({ open, changeOpen, children = null }) => {
  const siderBar = useMemo(SiderBar, []);

  return (
    <Drawer
      className={styles.box}
      sidebar={siderBar}
      position="right"
      open={open}
      contentStyle={{ height: '100%' }}
      onOpenChange={changeOpen}
    >
      {children}
    </Drawer>
  );
};

export default Sider;
