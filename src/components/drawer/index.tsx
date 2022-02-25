import React, { useState } from 'react';

import { Popup } from 'antd-mobile';

export type TOpener = ReturnType<typeof useDrawer>;

interface IDrawerProps {
  sideBar: React.ReactNode;
  children: any;
  opener: TOpener;
  fullScreen?: boolean;
}

const Drawer: React.FC<IDrawerProps> = ({ sideBar, children, opener, fullScreen = false }) => {
  const { close, visible } = opener;
  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={() => close()}
        position="right"
        bodyStyle={{ minWidth: '60vw', top: fullScreen ? 0 : 45 }}
      >
        {sideBar}
      </Popup>
      {children}
    </>
  );
};

export function useDrawer() {
  const [visible, change] = useState(false);

  const close = () => change(false);
  const open = () => change(true);
  const changeVisible = () => change(a => !a);

  return { open, close, visible, changeVisible };
}

export default Drawer;
