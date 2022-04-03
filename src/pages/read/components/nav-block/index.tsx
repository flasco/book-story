import { useMemo, useState, useCallback, useRef } from 'react';
import { Popover, ActionSheet, Modal, TextArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { changeSunny, sunny } = useTheme();
  const {
    api,
    cache: { list, record },
    showMenu,
  } = useReaderContext();

  const [progress, changeProgress] = useSwitch(false);
  const filterStr = useRef('');
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

  const openRegExpModal = () => {
    Modal.confirm({
      content: (
        <TextArea
          style={{ paddingTop: 8 }}
          rows={5}
          defaultValue={record.getFilters().join('\n') || ''}
          placeholder="请输入需要过滤规则，换行可以书写多条规则"
          onChange={val => {
            filterStr.current = val;
          }}
        />
      ),
      showCloseButton: true,
      title: '请输入过滤的正则表达式',
      onConfirm: () => {
        console.log(filterStr.current);
        api.setFilters(filterStr.current.split('\n'));
      },
    });
  };

  const popOtrMap = useMemo(
    () => [
      {
        text: '换源',
        onClick: () => {
          setTimeout(() => navigate('/origin'), 100);
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
      {
        text: '正则过滤',
        onClick: openRegExpModal,
      },
    ],
    [api]
  );

  return (
    <div className={cx(styles.container, { [styles.hidden]: !showMenu })}>
      <CatalogDrawer opener={opener} changeMenu={api.changeMenu}>
        <div className={styles.container}>
          <div className={styles.header}>
            <LeftOutline className={styles.back} onClick={() => navigate(-1)} />
            <Popover.Menu actions={popOtrMap} destroyOnHide trigger="click" placement="topRight">
              <div>
                <MoreOutline style={{ fontSize: 24 }} />
              </div>
            </Popover.Menu>
          </div>
          <Touchable needStop className={styles.content} onClick={() => api.changeMenu()} />
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
