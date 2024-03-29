import React, { useMemo } from 'react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import { NavBarProps } from 'antd-mobile/es/components/nav-bar';

import styles from './index.module.scss';

interface INavBarProps {
  title?: string;
  back?: boolean;
  showBar?: boolean;
}
interface IContainerProps extends INavBarProps {
  className?: string;
  topRight?: any;
}

const Container: React.FC<IContainerProps> = props => {
  const { children = null, className } = props;
  const { title = '标题', back = false, showBar = false, topRight = null } = props;

  const navigate = useNavigate();

  /** params 不应该动态改变 */
  const params = useMemo(() => {
    const payload: NavBarProps = {
      right: topRight,
    };
    payload.backArrow = back;

    if (back) {
      payload.onBack = () => navigate(-1);
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
