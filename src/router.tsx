import React from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';

import ThemeWrapper, { ContextWrapper } from './layout/theme-wrapper';

import Read from './pages/read';
import Shelf from './pages/shelf';
import Search from './pages/search';
import Detail from './pages/detail';
import SearchSetting from './pages/search-setting';

const Wrapper: React.FC = ({ children }) => (
  <ContextWrapper>
    <ThemeWrapper>{children}</ThemeWrapper>
  </ContextWrapper>
);

const basepath = `${location.pathname}#`;

const routes = () => (
  <Wrapper>
    <BrowserRouter basename={basepath}>
      <Switch>
        <Route path="/shelf" exact component={Shelf} />
        <Route path="/read" exact component={Read} />
        <Route path="/search" exact component={Search} />
        <Route path="/search-setting" exact component={SearchSetting} />
        <Route path="/detail" exact component={Detail} />

        <Redirect from="/*" exact to="/shelf" />
      </Switch>
    </BrowserRouter>
  </Wrapper>
);

export default routes;
