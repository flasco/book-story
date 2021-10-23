import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { BookProvider } from '@/hooks/use-book';
import { ThemeProvider } from '@/hooks/use-theme';

import ThemeWrapper from './layout/theme-wrapper';

import Read from './pages/read';
import Shelf from './pages/shelf';
import Search from './pages/search';
import Detail from './pages/detail';
import Origin from './pages/origin';
import { connectContext } from './utils';

const basepath = `${location.pathname}#`;

const routes = () => (
  <ThemeWrapper>
    <BrowserRouter basename={basepath}>
      <CacheSwitch>
        <CacheRoute when="forward" path="/shelf" exact component={Shelf} />
        <CacheRoute when="forward" path="/read" exact component={Read} />
        <CacheRoute when="forward" path="/search" exact component={Search} />
        <Route path="/origin" exact component={Origin} />
        <Route path="/detail" exact component={Detail} />
        <Route path="/origin" exact component={Origin} />

        <Redirect from="/*" exact to="/shelf" />
      </CacheSwitch>
    </BrowserRouter>
  </ThemeWrapper>
);

export default connectContext(routes, ThemeProvider, BookProvider);
