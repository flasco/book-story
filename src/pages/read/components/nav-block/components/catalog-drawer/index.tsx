import React, { useMemo } from 'react';
import SXider, { TOpener } from '@/components/drawer';

import CatalogList from './catalog-list';

import styles from './index.module.scss';

interface IProps {
  opener: TOpener;
  changeMenu: () => void;
}

const Sider: React.FC<IProps> = ({ opener, children = null, changeMenu }) => {
  const siderBar = useMemo(
    () => (
      <div className={styles.sider}>
        <div className={styles.title}>目录</div>
        <CatalogList opener={opener} changeMenu={changeMenu} />
      </div>
    ),
    [opener]
  );
  return <SXider fullScreen sideBar={siderBar} opener={opener} children={children} />;
};

export default Sider;
