import React, { useState } from 'react';

import { Popup } from 'antd-mobile';

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
      <Popup
        visible={visible}
        position="right"
        getContainer={null}
        onMaskClick={() => close()}
        bodyStyle={{ minWidth: '60vw', top: !fullScreen ? 45 : 0 }}
      >
        {sideBar}
      </Popup>
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
