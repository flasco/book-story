import { ee } from '@/main';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Toast } from 'antd-mobile';

import ListCache from '@/cache/list';
import RecordCache from '@/cache/record';
import ChaptersCache from '@/cache/chapter';
import Queue from '@/third-party/queue';
import { openLoading, closeLoading } from '@/utils';
import { newGetP } from '@/utils/text';

import { getList } from '@/pages/read/api';
import useBook from '@/hooks/use-book';

/**
 * 书籍进度存储key约定 record@${sourceUrl}
 * 书籍列表存储key约定 list@${sourceUrl}
 * 书籍章节存储key约定 chapter@${sourceUrl}
 */

/** 控制第一次进入章节时的变量 */
let ctrlPos = 0;

export const getCtrlPos = () => ctrlPos;
export const changeCtrlPos = (res: number) => (ctrlPos = res);

const useSingleBook = (catalogUrl: string) => {
  console.log(catalogUrl);
  const { books } = useBook(params => params.books);
  const book = books.find(i => i.catalogUrl === catalogUrl);
  return book;
};

const useWorker = (sourceUrl: string) => {
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

  return { worker: workArr, cachedChapters };
};

function useReader(sourceUrl: string) {
  const bookInfo = useSingleBook(sourceUrl);
  const [pages, setPages] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [watched, setWatched] = useState(1);
  const [showMenu, setShow] = useState(false);

  const changeMenu = useCallback(() => setShow(val => !val), [setShow]);

  const cachedList = useMemo(() => new ListCache(sourceUrl), [sourceUrl]);
  const cachedRecord = useMemo(() => new RecordCache(sourceUrl), [sourceUrl]);
  const { cachedChapters, worker } = useWorker(sourceUrl);

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
  }, [updateStates]);

  const prefetchChapter = useCallback(
    async (position, prefetch = true) => {
      const currentChapter = cachedList.getChapterUrl(position);
      if (prefetch) worker.push(cachedList.getChapterUrl(position + 1));
      return await cachedChapters.getContent(currentChapter);
    },
    [cachedList, cachedChapters]
  );

  const init: any = async () => {
    try {
      openLoading('数据加载中...');
      if (sourceUrl == null) throw '书源记录获取失败...';
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
      Toast.fail(error.message || error);
      setTitle('加载失败');
      setPages(['书籍列表信息加载失败']);
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

      setTitle(chapter.title);
      setPages(newGetP(chapter.content));
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
    title,
    pages,
    watched,
    showMenu,
    cache: {
      list: cachedList,
      record: cachedRecord,
    },
    api: {
      nextChapter,
      prevChapter,
      saveRecord,
      goToChapter,
      changeMenu,
    },
  };
}

export default useReader;
