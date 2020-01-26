import React, { useMemo } from 'react';
import SXider from '@/components/drawer';

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
    <SXider sideBar={siderBar} open={open} changeOpen={changeOpen}>
      {children}
    </SXider>
  );
};

export default Sider;
