import React, { useMemo } from 'react';
import cx from 'classnames';

import styles from './index.m.scss';
import { NavBar, Icon } from 'antd-mobile';

import { goBack } from '@/utils';

interface INavBarProps {
  title?: string;
  back?: boolean;
  showBar?: boolean;
}
interface IContainerProps extends INavBarProps {
  className?: string;
  topRight?: any;
}

const LeftIcon = <Icon type="left" className={styles.icon} />;

const Container: React.FC<IContainerProps> = props => {
  const { children = null, className } = props;
  const { title = '标题', back = false, showBar = false, topRight = null } = props;

  /** params 不应该动态改变 */
  const params = useMemo(() => {
    const payload: any = {
      rightContent: topRight,
    };
    if (back) {
      payload.icon = LeftIcon;
      payload.onLeftClick = () => goBack();
    }
    return payload;
  }, [topRight]);

  return (
    <div className={cx(styles.box, className)}>
      {showBar && <NavBar {...params}>{title}</NavBar>}
      {children}
    </div>
  );
};

export default Container;
