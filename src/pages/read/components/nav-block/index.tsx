import { useMemo, useState, useCallback } from 'react';
import { Icon } from 'antd-mobile';
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
  const { push } = useHistory();
  const { changeSunny, sunny } = useTheme();
  const {
    api: { changeMenu },
    showMenu,
  } = useReaderContext();

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

  return (
    <div className={cx(styles.container, { [styles.hidden]: !showMenu })}>
      <CatalogDrawer open={catalog} changeOpen={changeCatalog} changeMenu={changeMenu}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Icon type="left" className={styles.back} onClick={() => push('/')} />
            <span onClick={() => push('/origin')}>换源</span>
          </div>
          <Touchable className={styles.content} onClick={() => changeMenu()} />
          {/**TODO: 状态机，同一时间内只有一个面板展示 */}
          {progress && <ProgressBlock />}
          <div className={styles.footer}>
            {operatorMap.map(item => (
              <Touchable className={styles.item} key={item.title} onClick={item.click}>
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
