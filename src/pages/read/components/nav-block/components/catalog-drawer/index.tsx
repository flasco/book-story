import React, { useMemo } from 'react';
import SXider from '@/components/drawer';

import CatalogList from './catalog-list';

import styles from './index.m.scss';

interface IProps {
  open: boolean;
  changeOpen: () => void;
  changeMenu: () => void;
}

const Sider: React.FC<IProps> = ({ open, changeOpen, children = null, changeMenu }) => {
  const siderBar = useMemo(
    () => (
      <div className={styles.sider}>
        <div className={styles.title}>目录</div>
        <CatalogList changeOpen={changeOpen} open={open} changeMenu={changeMenu} />
      </div>
    ),
    [changeOpen, open]
  );
  return <SXider sideBar={siderBar} open={open} changeOpen={changeOpen} children={children} />;
};

export default Sider;
