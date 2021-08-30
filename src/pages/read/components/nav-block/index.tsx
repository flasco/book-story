import { useMemo, useState, useCallback } from 'react';
import { Icon, Popover, ActionSheet } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { ICON_FONT_MAP } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import Touchable from '@/components/touchable';

import { useReaderContext } from '../../context';

import ProgressBlock from './components/progress';
import CatalogDrawer from './components/catalog-drawer';

import styles from './index.m.scss';

const useSwitch = (initVal: boolean): [boolean, () => void] => {
  const [chx, setChx] = useState<boolean>(initVal);
  const changeX = useCallback(() => setChx(val => !val), []);

  return [chx, changeX];
};

const NavBlock = () => {
  const { push, goBack } = useHistory();
  const { changeSunny, sunny } = useTheme();
  const {
    api: { changeMenu, pretchWorker },
    cache: { list, record },
    showMenu,
  } = useReaderContext();

  const [popVisible, changePopVisible] = useState(false);
  const [progress, changeProgress] = useSwitch(false);
  const [catalog, changeCatalog] = useSwitch(false);
  const operatorMap = useMemo(() => {
    return [
      {
        title: '目录',
        icon: ICON_FONT_MAP.CATALOG,
        click: changeCatalog,
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

  const cacheMap = ['缓存20章', '缓存50章', '缓存200章', '取消'];
  const cacheCnts = [20, 50, 200];

  const popOtrMap = useMemo(
    () => [
      {
        title: '换源',
        onClick: () => push('/origin'),
      },
      {
        title: '缓存',
        onClick: () =>
          ActionSheet.showActionSheetWithOptions(
            {
              options: cacheMap,
              cancelButtonIndex: cacheMap.length - 1,
              message: '需要缓存多少章？',
              maskClosable: true,
            },
            buttonIndex => {
              const cnt = cacheCnts[buttonIndex];
              const position = record.getChapterPosition();
              const urls: string[] = [];
              for (let i = 1; i <= cnt; i++) {
                const url = list.getChapterUrl(i + position);
                if (url) urls.push(url);
              }
              pretchWorker(...urls);
            }
          ),
      },
    ],
    []
  );

  const onSelect = (_, index) => {
    popOtrMap[index].onClick();
    changePopVisible(false);
  };

  return (
    <div className={cx(styles.container, { [styles.hidden]: !showMenu })}>
      <CatalogDrawer open={catalog} changeOpen={changeCatalog} changeMenu={changeMenu}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Icon type="left" className={styles.back} onClick={() => goBack()} />
            <Popover
              visible={popVisible}
              onVisibleChange={a => {
                changePopVisible(a);
              }}
              align={{
                overflow: { adjustY: 0, adjustX: 10 },
              }}
              onSelect={onSelect}
              overlay={popOtrMap.map(i => (
                <Popover.Item key={i.title}>{i.title}</Popover.Item>
              ))}
            >
              <div
                style={{
                  height: '100%',
                  padding: '0 15px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon type="ellipsis" />
              </div>
            </Popover>

            {/* <span onClick={() => push('/origin')}>换源</span> */}
          </div>
          <Touchable needStop className={styles.content} onClick={() => changeMenu()} />
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
