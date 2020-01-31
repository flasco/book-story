import React, { useMemo } from 'react';

import SXider from '@/components/drawer';
import Touchable from '@/components/touchable';

import styles from './index.m.scss';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

const SiderBar = ({ push }) => {
  const onClick = () => push('/search');
  const { changeSunny } = useTheme();

  return (
    <div className={styles.sider}>
      <Touchable needStop className={styles.item} onClick={onClick}>
        搜索
      </Touchable>
      <Touchable needStop className={styles.item}>
        排行
      </Touchable>
      <Touchable needStop className={styles.item} onClick={changeSunny}>
        日夜切换
      </Touchable>
    </div>
  );
};

interface IProps {
  open: boolean;
  changeOpen: () => void;
}

const Sider: React.FC<IProps> = ({ open, changeOpen, children = null }) => {
  const { push } = useHistory();
  const siderBar = useMemo(() => <SiderBar push={push} />, [push]);

  return (
    <SXider sideBar={siderBar} open={open} changeOpen={changeOpen}>
      {children}
    </SXider>
  );
};

export default Sider;
