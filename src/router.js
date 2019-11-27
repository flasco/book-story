import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import Home from './pages/home';

const routes = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact component={Home} />
    </Switch>
  </HashRouter>
);

export default routes;
