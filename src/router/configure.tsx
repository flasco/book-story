import KeepAliver from '@/layout/keep-aliver';
import Read from '@/pages/read';
import Shelf from '@/pages/shelf';
import Search from '@/pages/search';
import Origin from '@/pages/origin';
import Detail from '@/pages/detail';

export type Component = React.ComponentType<any>;

export interface RouteConfig {
  path: string;
  models?: () => Array<PromiseLike<any>>;
  component: Component;
  exact?: boolean; // 完全匹配 has  routes 必须false
  name: string;
  icon?: Component;
  noCache?: boolean;
  children?: Array<this>;
  redirect?: string; // 重定向
}

const routesOther: Array<RouteConfig> = [
  {
    path: 'shelf',
    component: Shelf,
    name: 'shelf',
  },
  {
    path: 'read',
    component: Read,
    name: 'read',
  },
  {
    path: 'search',
    component: Search,
    name: 'search',
  },
  {
    path: 'origin',
    component: Origin,
    name: 'origin',
  },
  {
    path: 'detail',
    component: Detail,
    name: 'detail',
  },
];

export const routes: Array<RouteConfig> = [
  {
    path: '/*',
    name: 'keep-aliver',
    component: KeepAliver,
    children: routesOther,
  },
];
