import React, { useMemo } from 'react';
import cx from 'classnames';

import { useHistory } from 'react-router-dom';

import styles from './index.m.scss';
import { NavBar, Icon } from 'antd-mobile';

interface INavBarProps {
  title?: string;
  back?: boolean;
  showBar?: boolean;
}
interface IContainerProps extends INavBarProps {
  className?: string;
}

const LeftIcon = <Icon type="left" />;

const Container: React.FC<IContainerProps> = props => {
  const { children = null, className, title = '标题', back = false, showBar = false } = props;
  const history = useHistory();

  const params = useMemo(() => {
    const payload = back
      ? {
          icon: LeftIcon,
          onLeftClick: () => history.goBack(),
        }
      : {};
    return payload;
  }, [back]);

  return (
    <div className={cx(styles.box, className)}>
      {showBar && <NavBar {...params}>{title}</NavBar>}
      {children}
    </div>
  );
};

export default Container;
