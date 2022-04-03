import { HashRouter, Route, Routes } from 'react-router-dom';
import { routes } from './configure'; //路由文件
import { map } from 'ramda';
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
          {map(
            route => (
              <Route
                path={route.path}
                key={route.name}
                element={<route.component route={route} />}
              />
            ),
            routes
          )}
        </Routes>
      </HashRouter>
    </ThemeWrapper>
  );
};

export default connectContext(BaseRouter, ThemeProvider, BookProvider);
