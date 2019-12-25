import React from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import ThemeWrapper, { ContextWrapper } from './layout/theme-wrapper';

import Read from './pages/read';
import Shelf from './pages/shelf';

const Wrapper: React.FC = ({ children }) => (
  <ContextWrapper>
    <ThemeWrapper>{children}</ThemeWrapper>
  </ContextWrapper>
);

const routes = () => (
  <Wrapper>
    <HashRouter>
      <Switch>
        <Route path="/" exact render={() => <Redirect from="/" exact to="/shelf" />} />
        <Route path="/shelf" exact component={Shelf} />
        <Route path="/read" exact component={Read} />
      </Switch>
    </HashRouter>
  </Wrapper>
);

export default routes;
