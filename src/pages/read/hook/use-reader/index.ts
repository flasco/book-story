import { ee } from '@/event';
import { useState, useEffect, useMemo, useCallback } from 'react';

import ListCache from '@/cache/list';
import RecordCache from '@/cache/record';
import ChaptersCache from '@/cache/chapter';
import Queue from '@/third-party/queue';
import { openLoading, closeLoading, toastFail } from '@/utils';
import { newGetP } from '@/utils/text';

import { getList } from '@/pages/read/api';
import { IBook } from '@/definition';
import { Toast } from 'antd-mobile';

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
  Toast.success('缓存成功');
};

function useReader(bookInfo?: IBook) {
  const [pages, setPages] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [watched, setWatched] = useState(1);
  const [showMenu, setShow] = useState(false);

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
      if (item === '') return;
      await cachedChapters.getContent(item, 3);
    };
    workArr.work = prefetch;
    cachedQueue.work = prefetch;
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

      if (prefetch) {
        const urlArr = new Array(2)
          .fill(1)
          .map((_, ind) => cachedList.getChapterUrl(position + ind + 1));
        workArr.push(...urlArr);
      }
      return cachedChapters.getContent(currentChapter);
    },
    [cachedList, cachedChapters]
  );

  const pretchWorker = useCallback(
    (...urls: string[]) => {
      Toast.info('开始后台缓存...');
      cachedQueue.push(...urls);
    },
    [cachedQueue]
  );

  const init: any = async () => {
    try {
      openLoading('数据加载中...');
      if (sourceUrl == null) throw new Error('书源记录获取失败...');
      await cachedRecord.init();

      setWatched(cachedRecord.getWatchedPage());

      if (!(await cachedList.checkIsExist())) {
        const list = await getList(sourceUrl);
        cachedList.updateList(list);
      }

      const position = cachedRecord.getChapterPosition();
      const chapter = await prefetchChapter(position);

      setTitle(chapter.title);
      setPages(newGetP(chapter.content));
    } catch (error) {
      toastFail(error.message || error);
      setTitle('加载失败');
      setPages(['书籍列表信息加载失败']);
    } finally {
      closeLoading();
    }
  };

  const goToChapter = useCallback(
    async (position: number, ctrlPos: number) => {
      if (sourceUrl == null) throw new Error('书源记录获取失败...');
      if (position >= cachedList.getLength() || position < 0) return false;
      openLoading('数据加载中...');
      changeCtrlPos(ctrlPos);

      const chapter = await prefetchChapter(position);

      cachedRecord.updateRecord({
        recordChapterNum: position,
      });

      setTitle(chapter.title);
      setPages(newGetP(chapter.content));
      closeLoading();
      return true;
    },
    [sourceUrl]
  );

  const nextChapter = useCallback(async () => {
    if (sourceUrl == null) throw new Error('书源记录获取失败...');

    const position = cachedRecord.getChapterPosition() + 1;
    return goToChapter(position, 1);
  }, [sourceUrl]);

  /**
   * 清除当前缓存，重新加载
   * 不过服务器侧会有缓存，时间在 20 min
   * 当然三方书源更新时间无法保证，这个问题不大
   */
  const reloadChapter = useCallback(async () => {
    if (sourceUrl == null) throw new Error('书源记录获取失败...');

    const curpoi = cachedRecord.getChapterPosition();
    const curChapterUrl = cachedList.getChapterUrl(curpoi);

    cachedChapters.cleanChapterCache(curChapterUrl);
    return goToChapter(curpoi, 1);
  }, [sourceUrl]);

  const prevChapter = useCallback(async () => {
    if (sourceUrl == null) throw new Error('书源记录获取失败...');
    const position = cachedRecord.getChapterPosition() - 1;
    return goToChapter(position, -1);
  }, [sourceUrl]);

  /** 只存页数，章节在翻页的时候存 */
  const saveRecord = useCallback(
    (page: number) => {
      if (sourceUrl == null) throw new Error('书源记录获取失败...');

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
    cache: {
      list: cachedList,
      record: cachedRecord,
      chapters: cachedChapters,
    },
    api: {
      pretchWorker,
      nextChapter,
      prevChapter,
      saveRecord,
      goToChapter,
      reloadChapter,
      changeMenu,
    },
  };
}

export default useReader;
