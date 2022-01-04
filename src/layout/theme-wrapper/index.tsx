import { useMemo } from 'react';

import { useTheme } from '@/hooks/use-theme';

import styles from './index.module.scss';

const ThemeWrapper = ({ children }) => {
  const { sunny } = useTheme();
  const className = useMemo(() => (sunny ? styles.sunny : styles.night), [sunny]);

  return <div className={className}>{children}</div>;
};

export default ThemeWrapper;
