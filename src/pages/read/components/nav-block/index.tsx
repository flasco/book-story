import { useMemo, useState, useCallback } from 'react';
import { Popover, ActionSheet } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { LeftOutline, MoreOutline } from 'antd-mobile-icons';

import { ICON_FONT_MAP } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import Touchable from '@/components/touchable';

import { useReaderContext } from '../../context';

import ProgressBlock from './components/progress';
import CatalogDrawer from './components/catalog-drawer';

import styles from './index.module.scss';
import { useDrawer } from '@/components/drawer';

const useSwitch = (initVal: boolean): [boolean, () => void] => {
  const [chx, setChx] = useState<boolean>(initVal);
  const changeX = useCallback(() => setChx(val => !val), []);

  return [chx, changeX];
};

const NavBlock = () => {
  const { push, goBack } = useHistory();
  const { changeSunny, sunny } = useTheme();
  const {
    api,
    cache: { list, record },
    showMenu,
  } = useReaderContext();

  const [progress, changeProgress] = useSwitch(false);
  const opener = useDrawer();
  const operatorMap = useMemo(() => {
    return [
      {
        title: '目录',
        icon: ICON_FONT_MAP.CATALOG,
        click: opener.changeVisible,
      },
      {
        title: '进度',
        icon: ICON_FONT_MAP.PROGRESS,
        click: changeProgress,
      },
      {
        title: '设置',
        icon: ICON_FONT_MAP.CONDITION,
        click: () => console.log('123'),
      },
      {
        title: sunny ? '夜间' : '日间',
        icon: sunny ? ICON_FONT_MAP.MOON : ICON_FONT_MAP.SUN,
        click: changeSunny,
      },
    ];
  }, [sunny]);

  const cacheCnts = [20, 50, 200];

  const popOtrMap = useMemo(
    () => [
      {
        text: '换源',
        onClick: () => {
          setTimeout(() => push('/origin'), 100);
        },
      },
      {
        text: '缓存',
        onClick: () =>
          ActionSheet.show({
            extra: '需要缓存多少章？',
            cancelText: '取消',
            actions: [
              {
                text: '缓存20章',
                key: '20',
              },
              {
                text: '缓存50章',
                key: '50',
              },
              {
                text: '缓存200章',
                key: '200',
              },
            ],
            onAction: (_, buttonIndex) => {
              const cnt = cacheCnts[buttonIndex];
              if (cnt == null) return;
              const position = record.getChapterPosition();
              const urls: string[] = [];
              for (let i = 1; i <= cnt; i++) {
                const url = list.getChapterUrl(i + position);
                if (url) urls.push(url);
              }
              api.pretchWorker(...urls);
            },
          }),
      },
      {
        text: '重载本章',
        onClick: () => api.reloadChapter(),
      },
      {
        text: '重载列表',
        onClick: () => api.reloadList(),
      },
    ],
    [api]
  );

  return (
    <div className={cx(styles.container, { [styles.hidden]: !showMenu })}>
      <CatalogDrawer opener={opener} changeMenu={api.changeMenu}>
        <div className={styles.container}>
          <div className={styles.header}>
            <LeftOutline className={styles.back} onClick={() => goBack()} />
            <Popover.Menu actions={popOtrMap} destroyOnHide trigger="click" placement="topRight">
              <div style={{ paddingRight: 8 }}>
                <MoreOutline style={{ fontSize: 24 }} />
              </div>
            </Popover.Menu>
          </div>
          <Touchable needStop className={styles.content} onClick={() => api.changeMenu()} />
          {/**TODO: 状态机，同一时间内只有一个面板展示 */}
          {progress && <ProgressBlock />}
          <div className={styles.footer}>
            {operatorMap.map(item => (
              <Touchable needStop className={styles.item} key={item.title} onClick={item.click}>
                <i className="iconfont">{item.icon}</i>
                {item.title}
              </Touchable>
            ))}
          </div>
        </div>
      </CatalogDrawer>
    </div>
  );
};

export default NavBlock;
