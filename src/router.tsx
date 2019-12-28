import React from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';

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
      <Route path="/" exact render={() => <Redirect from="/" exact to="/shelf" />} />
      <Route path="/shelf" exact component={Shelf} />
      <Route path="/read" exact component={Read} />
    </BrowserRouter>
  </Wrapper>
);

export default routes;
