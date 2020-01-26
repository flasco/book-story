import React from 'react';
import { Drawer } from 'antd-mobile';

import styles from './index.m.scss';

interface IProps {
  open: boolean;
  changeOpen: () => void;
  sideBar?: React.ReactElement;
}

const Sider: React.FC<IProps> = ({ open, changeOpen, children = null, sideBar = null }) => {
  return (
    <Drawer
      className={styles.box}
      sidebar={sideBar}
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
