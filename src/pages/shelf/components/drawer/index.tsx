import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Toast } from 'antd-mobile';

import SXider, { TOpener } from '@/components/drawer';
import { clearTemp } from '@/storage/base';
import { useTheme } from '@/hooks/use-theme';
import Touchable from '@/components/touchable';

import styles from './index.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const version = ENV.PROJECT_VERSION_TAG;

const SiderBar = () => {
  const navigate = useNavigate();

  const onClick = () => navigate('/search');
  const { changeSunny } = useTheme();
  const onClear = useCallback(async () => {
    await clearTemp();
    alert('缓存清理成功');
  }, []);

  const onForceUpdate = useCallback(() => {
    Modal.show({
      title: '警告',
      content: '确定清理应用以获取最新版本吗？',
      actions: [
        {
          key: 'true',
          text: '确定',
          primary: true,
          onClick: () => {
            Modal.clear();
            caches
              .keys()
              .then(keys => Promise.all(keys.map(key => caches.delete(key))))
              .then(() =>
                Toast.show({
                  content: '清理完成，即将重启应用',
                  afterClose: () => {
                    window.location.reload();
                  },
                  duration: 2000,
                })
              );
          },
        },
        {
          key: 'cancel',
          text: '取消',
        },
      ],
    });
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
  opener: TOpener;
}

const Sider: React.FC<IProps> = ({ opener, children = null }) => {
  const siderBar = useMemo(() => <SiderBar />, []);

  return (
    <SXider sideBar={siderBar} opener={opener}>
      {children}
    </SXider>
  );
};

export default Sider;
