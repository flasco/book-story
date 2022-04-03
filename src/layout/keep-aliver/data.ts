import {
  clone,
  equals,
  find,
  findIndex,
  is,
  isEmpty,
  last,
  map,
  mergeRight,
  pick,
  pipe,
} from 'ramda';
import type { NavigateFunction } from 'react-router-dom';

export interface TagsViewDto {
  key: string;
  active: boolean;
  title: string;
  name: string;
  // ele: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null
}
export enum ActionType {
  del = 'DEL',
  delAdd = 'delAdd',
  add = 'ADD',
  update = 'UPDATE',
  clear = 'CLEAR',
}
interface ActionDel {
  type: ActionType.del;
  payload: ActionDelDto;
}

interface ActionDelAdd {
  type: ActionType.delAdd;
  payload: {
    navigate: NavigateFunction;
  };
}

interface ActionDelDto {
  key: string;
  navigate: NavigateFunction;
}
interface ActionClear {
  type: ActionType.clear;
  payload: undefined;
}
interface ActionTypeAddPayload {
  key: string;
  title: string;
  name: string;
}

interface ActionAdd {
  type: ActionType.add;
  payload: ActionTypeAddPayload;
}
interface ActionUp {
  type: ActionType.update;
  payload: Partial<TagsViewDto> | TagsViewDto[];
}
export interface ActionUpdateTitlePayload {
  key: string;
  title: string;
}
function isArray(arg: any): arg is Array<any> {
  return is(Array)(arg);
}
function delKeepAlive(keepAliveList: Array<TagsViewDto>, { key, navigate }: ActionDelDto) {
  const index = findIndex(item => equals(item.key, key), keepAliveList);
  if (equals(index, -1)) {
    return keepAliveList;
  }
  let pathname = '';
  if (keepAliveList.length > 1) {
    const index = findIndex(item => equals(item.key, key), keepAliveList);
    const data = keepAliveList[index];
    // 如果删除是  当前渲染     需要移动位置
    if (data && data.active) {
      // 如果是最后一个 那么  跳转到上一个
      if (equals(index, keepAliveList.length - 1)) {
        pathname = keepAliveList[index - 1].key;
      } else {
        // 跳转到最后一个
        pathname = last(keepAliveList)?.key ?? '';
      }
    }
  }
  keepAliveList.splice(index, 1);
  if (!isEmpty(pathname)) {
    navigate({ pathname });
  }
  return clone(keepAliveList);
}
const mergeMatchRoute = pipe(pick(['key', 'title', 'ele', 'name']), mergeRight({ active: true }));

function addKeepAlive(state: Array<TagsViewDto>, matchRouteObj: ActionTypeAddPayload) {
  if (state.some(item => equals(item.key, matchRouteObj.key) && item.active)) {
    return state;
  }
  let isNew = true;
  // 改变选中的值
  const data = map(item => {
    if (equals(item.key, matchRouteObj.key)) {
      item.active = true;
      isNew = false;
    } else {
      item.active = false;
    }
    return item;
  }, state);
  if (isNew) {
    if (data.length >= 10) {
      data.shift();
    }
    data.push(mergeMatchRoute(matchRouteObj));
  }
  return data;
}

const updateKeepAlive = (state: Array<TagsViewDto>, keepAlive: Partial<TagsViewDto>) =>
  map(item => (equals(item.key, keepAlive.key) ? mergeRight(item, keepAlive) : item), state);
const updateKeepAliveList = (state: Array<TagsViewDto>, keepAlive: Array<TagsViewDto>) =>
  map(item => {
    const data = find(res => equals(res.key, item.key), keepAlive);
    if (data) {
      item = mergeRight(item, data ?? {});
    }
    return item;
  }, state);
export type Action = ActionDel | ActionAdd | ActionClear | ActionUp | ActionDelAdd;
export const reducer = (state: Array<TagsViewDto>, action: Action): TagsViewDto[] => {
  switch (action.type) {
    case ActionType.add:
      return addKeepAlive(state, action.payload);
    case ActionType.del:
      return delKeepAlive(state, action.payload);
    case ActionType.clear:
      return [];
    case ActionType.update:
      return isArray(action.payload)
        ? updateKeepAliveList(state, action.payload)
        : updateKeepAlive(state, action.payload);
    case ActionType.delAdd: {
      const index = state.length - 1;
      state.splice(index, 1);
      return addKeepAlive(state, action.payload as any);
    }
    default:
      return state;
  }
};
