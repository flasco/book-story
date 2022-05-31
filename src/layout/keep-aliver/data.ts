import { cloneDeep } from 'lodash-es';
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
  needCutTop: boolean;
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
  return Array.isArray(arg);
}
function delKeepAlive(keepAliveList: Array<TagsViewDto>, { key, navigate }: ActionDelDto) {
  const index = keepAliveList.findIndex(item => item.key === key);
  if (index === -1) {
    return keepAliveList;
  }
  let pathname = '';
  if (keepAliveList.length > 1) {
    const index = keepAliveList.findIndex(item => item.key === key);
    const data = keepAliveList[index];
    // 如果删除是  当前渲染     需要移动位置
    if (data && data.active) {
      // 如果是最后一个 那么  跳转到上一个
      if (index === keepAliveList.length - 1) {
        pathname = keepAliveList[index - 1].key;
      } else {
        // 跳转到最后一个
        pathname = keepAliveList[keepAliveList.length - 1]?.key ?? '';
      }
    }
  }
  keepAliveList.splice(index, 1);
  if (!pathname) {
    navigate({ pathname });
  }
  return cloneDeep(keepAliveList);
}

function addKeepAlive(state: Array<TagsViewDto>, matchRouteObj: ActionTypeAddPayload) {
  if (state.some(item => item.key === matchRouteObj.key && item.active)) {
    return state;
  }
  let isNew = true;
  // 改变选中的值
  const data = state.map(item => {
    if (item.key === matchRouteObj.key) {
      item.active = true;
      isNew = false;
    } else {
      item.active = false;
    }
    return item;
  });
  if (isNew) {
    if (data.length >= 10) {
      data.shift();
    }
    data.push({
      active: true,
      key: matchRouteObj.key,
      title: matchRouteObj.title,
      name: matchRouteObj.name,
    });
  }
  return data;
}

const updateKeepAlive = (state: Array<TagsViewDto>, keepAlive: Partial<TagsViewDto>) =>
  state.map(item => (item.key === keepAlive.key ? Object.assign(item, keepAlive) : item));
const updateKeepAliveList = (state: Array<TagsViewDto>, keepAlive: Array<TagsViewDto>) =>
  state.map(item => {
    const data = keepAlive.find(res => res.key === item.key);
    if (data) {
      Object.assign(item, data ?? {});
    }
    return item;
  });
export type Action = ActionDel | ActionAdd | ActionClear | ActionUp | ActionDelAdd;
export const reducer = (state: Array<TagsViewDto>, action: Action): TagsViewDto[] => {
  switch (action.type) {
    case ActionType.add: {
      if (action.payload.needCutTop) {
        const index = state.length - 1;
        state.splice(index, 1);
      }
      return addKeepAlive(state, action.payload);
    }
    case ActionType.del:
      return delKeepAlive(state, action.payload);
    case ActionType.clear:
      return [];
    case ActionType.update:
      return isArray(action.payload)
        ? updateKeepAliveList(state, action.payload)
        : updateKeepAlive(state, action.payload);
    default:
      return state;
  }
};
