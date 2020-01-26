import React, { useMemo, useState, useCallback } from 'react';
import { Icon } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { useReaderContext } from '../../context';
import Touchable from '@/components/touchable';

import styles from './index.m.scss';
import { ICON_FONT_MAP } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import ProgressBlock from './components/progress';

const useSwitch = (initVal: boolean): [boolean, () => void] => {
  const [chx, setChx] = useState<boolean>(initVal);
  const changeX = useCallback(() => setChx(val => !val), []);

  return [chx, changeX];
};

const NavBlock = () => {
  const { goBack } = useHistory();
  const { changeSunny } = useTheme();
  const {
    api: { changeMenu },
    showMenu,
  } = useReaderContext();

  const [progress, changeProgress] = useSwitch(false);

  const operatorMap = useMemo(() => {
    return [
      {
        title: '目录',
        icon: ICON_FONT_MAP.CATALOG,
        click: () => console.log('123'),
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
        title: '夜间',
        icon: ICON_FONT_MAP.MOON,
        click: () => changeSunny(),
      },
    ];
  }, []);
  return (
    <div className={cx(styles.container, { [styles.hidden]: !showMenu })}>
      <div className={styles.header}>
        <Icon type="left" className={styles.back} onClick={goBack} />
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
  );
};

export default NavBlock;
