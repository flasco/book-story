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
  // eslint-disable-next-line react/no-children-prop
  return <SXider sideBar={siderBar} opener={opener} children={children} fullScreen />;
};

export default Sider;
