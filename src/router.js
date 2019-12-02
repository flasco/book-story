import React from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';
import Home from './pages/home';
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
      <Route exact path="/" render={() => <Redirect from="/" to="/shelf" />} />
      <Route path="/shelf" exact component={Shelf} />
      <Route path="/read" exact component={Home} />
    </Switch>
  </HashRouter>
);

export default routes;
