import { useState } from 'react';
import cx from 'classnames';

import { Mask } from 'antd-mobile';

import styles from './index.module.scss';

interface IDrawerProps {
  sideBar: JSX.Element;
  children: any;
  opener: TOpener;
  fullScreen?: boolean;
}

const Drawer: React.FC<IDrawerProps> = ({ sideBar, children, opener, fullScreen = false }) => {
  const { close, visible } = opener;
  return (
    <>
      <Mask
        visible={visible}
        dissipationDuration={150}
        onMaskClick={() => close()}
        className={cx({ [styles.mask]: !fullScreen })}
      >
        <div className={styles.floater}>{sideBar}</div>
      </Mask>
      {children}
    </>
  );
};

export type TOpener = ReturnType<typeof useDrawer>;

export const useDrawer = () => {
  const [visible, change] = useState(false);

  const close = () => change(false);
  const open = () => change(true);
  const changeVisible = () => change(a => !a);

  return { open, close, visible, changeVisible };
};

export default Drawer;
