import React, { useMemo } from 'react';

import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import styles from './index.m.scss';

export const ContextWrapper: React.FC = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

const ThemeWrapper = ({ children }) => {
  const { sunny } = useTheme();
  const className = useMemo(() => (sunny ? styles.sunny : styles.night), [sunny]);

  return <div className={className}>{children}</div>;
};

export default ThemeWrapper;
