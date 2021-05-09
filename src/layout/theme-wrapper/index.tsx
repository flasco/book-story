import { useMemo } from 'react';

import { BookProvider } from '@/hooks/use-book';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import styles from './index.module.scss';

export const ContextWrapper: React.FC = ({ children }) => {
  return (
    <BookProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </BookProvider>
  );
};

const ThemeWrapper = ({ children }) => {
  const { sunny } = useTheme();
  const className = useMemo(() => (sunny ? styles.sunny : styles.night), [sunny]);

  return <div className={className}>{children}</div>;
};

export default ThemeWrapper;
