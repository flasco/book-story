import { HashRouter, Route, Routes } from 'react-router-dom';
import { routes } from './configure'; //路由文件
import ThemeWrapper from '@/layout/theme-wrapper';

import { connectContext } from '@/utils';
import { ThemeProvider } from '@/hooks/use-theme';
import { BookProvider } from '@/hooks/use-book';

// 创建 同步路由文件
const BaseRouter = (): JSX.Element => {
  return (
    <ThemeWrapper>
      <HashRouter>
        <Routes>
          {routes.map(route => (
            <Route path={route.path} key={route.name} element={<route.component route={route} />} />
          ))}
        </Routes>
      </HashRouter>
    </ThemeWrapper>
  );
};

export default connectContext(BaseRouter, ThemeProvider, BookProvider);
