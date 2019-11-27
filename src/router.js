import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import Home from './pages/home';

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
      <Route path="/" exact component={Home} />
    </Switch>
  </HashRouter>
);

export default routes;
