import { ee } from '@/main';
import { useEffect, useMemo, useCallback, useReducer } from 'react';

import ListCache from '@/cache/list';
import RecordCache from '@/cache/record';
import ChaptersCache from '@/cache/chapter';
import Queue from '@/third-party/queue';
import { openLoading, closeLoading, toastFail } from '@/utils';
import { newGetP } from '@/utils/text';

import { getList } from '@/pages/read/api';
import { IBook } from '@/defination';

/**
 * 书籍进度存储key约定 record@${sourceUrl}
 * 书籍列表存储key约定 list@${sourceUrl}
 * 书籍章节存储key约定 chapter@${sourceUrl}
 */

/** 控制第一次进入章节时的变量 */
let ctrlPos = 0;

export const getCtrlPos = () => ctrlPos;
export const changeCtrlPos = (res: number) => (ctrlPos = res);

const initialState = {
  pages: [] as any[],
  title: '',
  watched: 1,
  showMenu: false,
};

type InitialState = typeof initialState;

type ActionMap = 'setState' | 'changeMenu';

interface IAction {
  type: ActionMap;
  payload?: Partial<InitialState>;
}

function reducer(state: InitialState, action: IAction) {
  switch (action.type) {
    case 'changeMenu':
      return { ...state, showMenu: !state.showMenu };
    case 'setState':
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
}

function useReader(bookInfo?: IBook) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const sourceUrl = useMemo(() => (bookInfo?.catalogUrl ?? null) as string, [bookInfo]);
  const cachedList = useMemo(() => new ListCache(sourceUrl), [sourceUrl]);
  const cachedRecord = useMemo(() => new RecordCache(sourceUrl), [sourceUrl]);
  const cachedChapters = useMemo(() => new ChaptersCache(sourceUrl), [sourceUrl]);
  const workArr = useMemo(() => {
    const queue = new Queue<string>(3);
    queue.drain = () => null;
    return queue;
  }, []);

  useEffect(() => {
    // prefetch
    workArr.work = async item => {
      if (item === '') return;
      await cachedChapters.getContent(item, 3);
    };
  }, [cachedChapters]);

  useEffect(() => {
    init();
  }, [bookInfo]);

  const updateStates = useCallback((isActive: boolean) => {
    if (!isActive) {
      cachedRecord.updateRecord({}, true);
      cachedChapters.updateChapters();
    }
  }, []);

  useEffect(() => {
    ee.on('app-state', updateStates);
    return () => {
      updateStates(false);
      ee.off('app-state', updateStates);
    };
  }, []);

  const prefetchChapter = useCallback(
    async (position, prefetch = true) => {
      const currentChapter = cachedList.getChapterUrl(position);
      if (prefetch) workArr.push(cachedList.getChapterUrl(position + 1));
      return await cachedChapters.getContent(currentChapter);
    },
    [cachedList, cachedChapters]
  );

  const init: any = async () => {
    try {
      openLoading('数据加载中...');
      if (sourceUrl == null) throw '书源记录获取失败...';
      await cachedRecord.init();

      if (!(await cachedList.checkIsExist())) {
        const list = await getList(sourceUrl);
        cachedList.updateList(list);
      }

      const position = cachedRecord.getChapterPosition();
      const chapter = await prefetchChapter(position);

      dispatch({
        type: 'setState',
        payload: {
          watched: cachedRecord.getWatchedPage(),
          title: chapter.title,
          pages: newGetP(chapter.content),
        },
      });
    } catch (error) {
      toastFail(error.message || error);
      dispatch({
        type: 'setState',
        payload: {
          watched: cachedRecord.getWatchedPage(),
          title: '加载失败',
          pages: ['书籍列表信息加载失败'],
        },
      });
    } finally {
      closeLoading();
    }
  };

  const goToChapter = useCallback(
    async (position: number, ctrlPos: number) => {
      if (sourceUrl == null) throw '书源记录获取失败...';
      if (position >= cachedList.getLength() || position < 0) return false;
      openLoading('数据加载中...');
      changeCtrlPos(ctrlPos);

      const chapter = await prefetchChapter(position);

      cachedRecord.updateRecord({
        recordChapterNum: position,
      });
      dispatch({
        type: 'setState',
        payload: {
          title: chapter.title,
          pages: newGetP(chapter.content),
        },
      });
      closeLoading();

      return true;
    },
    [sourceUrl]
  );

  const nextChapter = useCallback(async () => {
    if (sourceUrl == null) throw '书源记录获取失败...';

    const position = cachedRecord.getChapterPosition() + 1;
    return await goToChapter(position, 1);
  }, [sourceUrl]);

  const prevChapter = useCallback(async () => {
    if (sourceUrl == null) throw '书源记录获取失败...';
    const position = cachedRecord.getChapterPosition() - 1;
    return await goToChapter(position, -1);
  }, [sourceUrl]);

  /** 只存页数，章节在翻页的时候存 */
  const saveRecord = useCallback(
    (page: number) => {
      if (sourceUrl == null) throw '书源记录获取失败...';

      cachedRecord.updateRecord({
        recordPage: page + 1,
      });
    },
    [sourceUrl, cachedRecord]
  );

  return {
    ...state,
    cache: {
      list: cachedList,
      record: cachedRecord,
    },
    api: {
      nextChapter,
      prevChapter,
      saveRecord,
      goToChapter,
      changeMenu: () => dispatch({ type: 'changeMenu' }),
    },
  };
}

export default useReader;
