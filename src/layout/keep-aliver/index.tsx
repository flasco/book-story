import KeepAlive from '@/components/keep-alive';
import { RouteConfig } from '@/router/configure';
import { last } from 'ramda';
import React, { useEffect, useMemo, useReducer } from 'react';
import {
  RouteMatch,
  RouteObject,
  useLocation,
  useNavigate,
  useNavigationType,
  useRoutes,
} from 'react-router-dom';
import { Action, ActionType, reducer } from './data';
import { ViewProvider } from './use-view';

export interface RouteObjectDto extends RouteObject {
  name: string;
  meta?: { title: string };
}

function makeRouteObject(
  routes: RouteConfig[],
  dispatch: React.Dispatch<Action>
): Array<RouteObjectDto> {
  return routes.map(route => {
    return {
      path: route.path,
      name: route.name,
      element: (
        <ViewProvider value={{ name: route.name }}>
          <route.component name={route.name} dispatch={dispatch} />
        </ViewProvider>
      ),
      children: route.children == null ? undefined : makeRouteObject(route.children, dispatch),
    };
  });
}

interface Props {
  route: RouteConfig;
}

function getLatchRouteByEle(
  ele: React.ReactElement<any, string | React.JSXElementConstructor<any>>
): RouteMatch<string>[] | null {
  const data = ele?.props.value;
  return data.outlet == null
    ? (data.matches as RouteMatch<string>[])
    : getLatchRouteByEle(data.outlet);
}

const KeepAliver: React.FC<Props> = ({ route }) => {
  const location = useLocation();
  const locationType = useNavigationType();
  const navigate = useNavigate();
  const [keepAliveList, dispatch] = useReducer(reducer, []);
  // 生成子路由
  const routeObject = useMemo(() => {
    if (route.children) {
      return makeRouteObject(route.children, dispatch);
    }
    return [];
  }, [route.children]);
  // 匹配 当前路径要渲染的路由
  const ele = useRoutes(routeObject);
  // 计算 匹配的路由name
  const matchRouteObj = useMemo(() => {
    if (ele == null) {
      return null;
    }
    const matchRoute = getLatchRouteByEle(ele);
    if (matchRoute == null) {
      return null;
    }

    const data = last(matchRoute)?.route as RouteObjectDto;
    const key = (last(matchRoute)?.pathname === '/shelf' ? 'shelf' : location.key) ?? '';
    return {
      key,
      title: data?.meta?.title ?? '',
      name: data?.name ?? '',
    };
  }, [ele]);
  // 缓存渲染 & 判断是否404
  useEffect(() => {
    console.log('KeepAliver useEffect', matchRouteObj, locationType);
    if (matchRouteObj) {
      dispatch({
        type: ActionType.add,
        payload: {
          needCutTop: locationType === 'POP' || locationType === 'REPLACE',
          ...matchRouteObj,
        },
      });
    } else {
      navigate({
        pathname: '/shelf',
      });
    }
  }, [location.key]);
  const includeKeys = useMemo(() => {
    return keepAliveList.map(res => res.key);
  }, [keepAliveList]);
  return (
    <KeepAlive activeName={matchRouteObj?.key} includeKeys={includeKeys}>
      {ele}
    </KeepAlive>
  );
};

export default KeepAliver;
