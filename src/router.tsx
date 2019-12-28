import React from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';

import ThemeWrapper, { ContextWrapper } from './layout/theme-wrapper';

import Read from './pages/read';
import Shelf from './pages/shelf';

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
        <Redirect from="/*" exact to="/shelf" />
      </Switch>
    </BrowserRouter>
  </Wrapper>
);

export default routes;
