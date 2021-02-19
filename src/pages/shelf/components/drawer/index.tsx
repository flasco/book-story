import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Toast } from 'antd-mobile';

import SXider from '@/components/drawer';
import { clearTemp } from '@/storage/base';
import { useTheme } from '@/hooks/use-theme';
import Touchable from '@/components/touchable';

import styles from './index.m.scss';

const version = process.env.PROJECT_VERSION_TAG;

const SiderBar = ({ push }) => {
  const onClick = () => push('/search');
  const { changeSunny } = useTheme();
  const onClear = useCallback(async () => {
    await clearTemp();
    alert('缓存清理成功');
  }, []);

  const onForceUpdate = useCallback(() => {
    Modal.alert('警告', '确定清理应用以获取最新版本吗？', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () =>
          caches
            .keys()
            .then(keys => Promise.all(keys.map(key => caches.delete(key))))
            .then(() =>
              Toast.info('清理完成，即将重启应用', 2, () => {
                window.location.reload();
              })
            ),
      },
    ]);
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
      <Touchable needStop className={styles.item} onClick={onForceUpdate}>
        强制更新
      </Touchable>
      <div className={styles.version}>Version: {version}</div>
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
