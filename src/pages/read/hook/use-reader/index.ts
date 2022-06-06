import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import { Toast } from 'antd-mobile';

import { ee } from '@/third-party/event';

import ListCache from '@/cache/list';
import RecordCache from '@/cache/record';
import ChaptersCache from '@/cache/chapter';
import Queue from '@/third-party/queue';
import { openLoading, closeLoading, toastFail } from '@/utils';
import { formatPageContent } from '@/utils/text';

import { getList } from '@/pages/read/api';
import { IBook } from '@/definition';


/**
 * 书籍进度存储key约定 record@${sourceUrl}
 * 书籍列表存储key约定 list@${sourceUrl}
 * 书籍章节存储key约定 chapter@${sourceUrl}
 */

/** 控制第一次进入章节时的变量 */
let ctrlPos = 0;

export const getCtrlPos = () => ctrlPos;
export const changeCtrlPos = (res: number) => (ctrlPos = res);

const cachedQueue = new Queue<string>(3);

cachedQueue.drain = () => {
  Toast.show('缓存成功');
};

function useReader(bookInfo?: IBook) {
  const [pages, setPages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [watched, setWatched] = useState(1);
  const [showMenu, setShow] = useState(false);
  const nextChapterUrl = useRef<string>('');
  // 是否是新版的多页结构
  const hasMultiPage = useRef<boolean>(false);
  const multiChapterStack = useRef<string[]>([]);
  const canBackToLast = useRef<boolean>(false);
  const appendTitleSuffix = useCallback((title: string) => {
    if (!hasMultiPage.current) {
      return title;
    }

    return `${title}_${multiChapterStack.current.length - 1}`;
  }, [multiChapterStack, hasMultiPage]);

  const changeMenu = useCallback(() => setShow(val => !val), [setShow]);

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
    const prefetch = async item => {
      if (item === '') {
        return;
      }
      await cachedChapters.getContent(item, 3);
    };
    workArr.work = prefetch;
    cachedQueue.work = prefetch;
  }, [cachedChapters]);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
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
    (position: number, chapterUrl: string, prefetch = true) => {
      if (prefetch) {
        const urlArr = new Array(2)
          .fill(1)
          .map((_, ind) => cachedList.getChapterUrl(position + ind + 1));
        workArr.push(...urlArr);
      }
      return cachedChapters.getContent(chapterUrl).then(chapter => {
        // prefetch nextUrl
        if (chapter.nextUrl) {
          cachedChapters.getContent(chapter.nextUrl);
          hasMultiPage.current = true;
        }
        return chapter;
      });
    },
    [cachedList, cachedChapters]
  );

  const prefetchWorker = useCallback(
    (...urls: string[]) => {
      Toast.show('开始后台缓存...');
      cachedQueue.push(...urls);
    },
    [cachedQueue]
  );

  const init = async () => {
    try {
      openLoading('数据加载中...');
      if (sourceUrl == null) {
        throw new Error('书源记录获取失败...');
      }
      await cachedRecord.init();

      setWatched(cachedRecord.getWatchedPage());

      if (!(await cachedList.checkIsExist())) {
        const list = await getList(sourceUrl);
        cachedList.updateList(list);
      }

      const position = cachedRecord.getChapterPosition();
      const lastReadChapter = cachedRecord.getLastReadChapterUrl() || cachedList.getChapterUrl(position);
      multiChapterStack.current = [lastReadChapter];

      const chapter = await prefetchChapter(position, lastReadChapter);
      nextChapterUrl.current = chapter.nextUrl || '';
      setTitle(appendTitleSuffix(chapter.title || cachedList.getChapterName(position)));
      setPages(formatPageContent(chapter.content, cachedRecord.getFilters()));
    } catch (error) {
      console.trace(error);
      toastFail((error as any).message || error);
      setTitle('加载失败');
      setPages(['书籍列表信息加载失败']);
    } finally {
      closeLoading();
    }
  };

  interface IParams {
    ctrlPos: number;
    position: number;
    chapterUrl?: string;
  }

  const goToChapter = useCallback(
    async ({ position, chapterUrl, ctrlPos }: IParams) => {
      if (chapterUrl == null) {
        chapterUrl = cachedList.getChapterUrl(position);
      }

      if (sourceUrl == null) throw new Error('书源记录获取失败...');
      const neededPosition = cachedList.findChapterPosition(chapterUrl);
      const curPosition = neededPosition > -1 ? neededPosition : position;
 
      if ((position >= cachedList.getLength() || position < 0) && !chapterUrl) return false;

      openLoading('数据加载中...');
      changeCtrlPos(ctrlPos);

      let curChapterUrl: string;
      /**
       * if curPosition === -1
       * 说明当前记录的 chapterURL 不存在于列表中，是一章打碎的那种
       * 需要直接用记录好的 chapterURL
       */
      if (neededPosition === -1) {
        curChapterUrl = chapterUrl;
        if (ctrlPos === 1) {
          multiChapterStack.current.push(chapterUrl);
          canBackToLast.current = true;
        }

        cachedRecord.updateRecord({
          recordChapterUrl: curChapterUrl,
        });
      } else {
        curChapterUrl = cachedList.getChapterUrl(curPosition);
        multiChapterStack.current = [curChapterUrl];
        cachedRecord.updateRecord({
          recordChapterNum: curPosition,
          recordChapterUrl: curChapterUrl,
        });
      }

      /** 如果是一章的起始，可以更新 recordChapterNum */

      const chapter = await prefetchChapter(curPosition, curChapterUrl);

      // 因为 position 已经在翻页的时候就做过 change 了，所以不需要再额外做增减操作
      nextChapterUrl.current = chapter.nextUrl || cachedList.getChapterUrl(position);

      setTitle(appendTitleSuffix(chapter.title || cachedList.getChapterName(curPosition)));
      setPages(formatPageContent(chapter.content, cachedRecord.getFilters()));
      closeLoading();
      return true;
    },
    [sourceUrl]
  );

  const nextChapter = useCallback(async () => {
    if (sourceUrl == null) throw new Error('书源记录获取失败...');

    return goToChapter({
      position: cachedRecord.getChapterPosition() + 1,
      ctrlPos: 1,
      chapterUrl: nextChapterUrl.current,
    });
  }, [sourceUrl]);

  const reloadList = useCallback(() => {
    console.log(sourceUrl);
    if (sourceUrl == null) {
      throw new Error('书源记录获取失败...');
    }

    cachedList.cleanListCache();
    init();
  }, [sourceUrl]);
  /**
   * 清除当前缓存，重新加载
   * 不过服务器侧会有缓存，时间在 20 min
   * 当然三方书源更新时间无法保证，这个问题不大
   */
  const reloadChapter = useCallback(
    () => {
      if (sourceUrl == null) {
        throw new Error('书源记录获取失败...');
      }

      const curPoi = cachedRecord.getChapterPosition();
      const curChapterUrl = cachedList.getChapterUrl(curPoi);

    cachedChapters.cleanChapterCache(curChapterUrl);
    return goToChapter({ position: curPoi, ctrlPos: 1, chapterUrl: curChapterUrl });
  }, [sourceUrl]);

  const prevChapter = useCallback(() => {
    if (sourceUrl == null) {
      throw new Error('书源记录获取失败...');
    }
    console.log(multiChapterStack.current);
    const position = cachedRecord.getChapterPosition() - 1;
    multiChapterStack.current.pop();
    canBackToLast.current = multiChapterStack.current.length !== 0;
    const chapterUrl = multiChapterStack.current?.[multiChapterStack.current.length - 1] || cachedList.getChapterUrl(position);
    return goToChapter({ position, ctrlPos: -1, chapterUrl });
  }, [sourceUrl]);

  const setFilters = (filters: string[]) => {
    cachedRecord.updateRecord({
      filters,
    });
    const curPoi = cachedRecord.getChapterPosition();
    return goToChapter({ position: curPoi, ctrlPos: 0, chapterUrl: cachedList.getChapterUrl(curPoi) });
  };

  /** 只存页数，章节在翻页的时候存 */
  const saveRecord = useCallback(
    (page: number) => {
      if (sourceUrl == null) {
        throw new Error('书源记录获取失败...');
      }

      cachedRecord.updateRecord({
        recordPage: page + 1,
      });
    },
    [sourceUrl, cachedRecord]
  );

  return {
    title,
    pages,
    watched,
    showMenu,
    hasMultiPage,
    canBackToLast,
    cache: {
      list: cachedList,
      record: cachedRecord,
      chapters: cachedChapters,
    },
    api: {
      prefetchWorker,
      nextChapter,
      prevChapter,
      saveRecord,
      goToChapter,
      reloadChapter,
      changeMenu,
      reloadList,
      setFilters,
    },
  };
}

export default useReader;
