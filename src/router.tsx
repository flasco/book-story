import React from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import ThemeWrapper from './layout/theme-wrapper';

import Read from './pages/read';
import Shelf from './pages/shelf';

// const Home = suspenseContainer(lazy(() => import('./pages/home')));

// function suspenseContainer(Component) {
//   return (props) => (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Component {...props} />
//     </Suspense>
//   );
// }

const routes = () => (
  <HashRouter>
    <Switch>
      <ThemeWrapper>
        <Route
          exact
          path="/"
          render={() => <Redirect from="/" to="/shelf" />}
        />
        <Route path="/shelf" exact component={Shelf} />
        <Route path="/read" exact component={Read} />
      </ThemeWrapper>
    </Switch>
  </HashRouter>
);

export default routes;
