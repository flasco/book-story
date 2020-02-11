import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import SXider from '@/components/drawer';
import { clearTemp } from '@/storage/base';
import { useTheme } from '@/hooks/use-theme';
import Touchable from '@/components/touchable';

import styles from './index.m.scss';

const SiderBar = ({ push }) => {
  const onClick = () => push('/search');
  const { changeSunny } = useTheme();
  const onClear = useCallback(async () => {
    await clearTemp();
    alert('缓存清理成功');
  }, []);

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
      <Touchable needStop className={styles.item} onClick={onClear}>
        缓存清理
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
