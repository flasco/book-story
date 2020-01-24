import React, { useMemo } from 'react';
import { Icon } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { useReaderContext } from '../../context';
import Touchable from '@/components/touchable';

import styles from './index.m.scss';
import { ICON_FONT_MAP } from '@/constants';
import { useTheme } from '@/hooks/use-theme';

const NavBlock = () => {
  const { goBack } = useHistory();
  const { changeSunny } = useTheme();
  const { changeMenu, showMenu } = useReaderContext();

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
        click: () => console.log('123'),
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
      <div className={styles.content} onClick={() => changeMenu()} />
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
