import { ee } from '@/main';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Toast } from 'antd-mobile';

import { openLoading, closeLoading } from '@/utils';
import ListCache from '@/cache/list';
import RecordCache from '@/cache/record';
import { newGetP } from '@/utils/text';
import { getBookRecord } from '@/storage/book';

import { getChapter, getList } from '@/pages/read/api';
import { IBook } from '@/defination';

/**
 * 书籍进度存储key约定 record@${sourceUrl}
 * 书籍列表存储key约定 list@${sourceUrl}
 * 书籍章节存储key约定 chapter@${sourceUrl}
 */

function useReader(bookInfo?: IBook) {
  const [pages, setPages] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [watched, setWatched] = useState(1);
  const [showMenu, setShow] = useState(false);

  const changeMenu = useCallback(() => setShow(!showMenu), [showMenu]);

  const sourceUrl = useMemo(() => (bookInfo?.source[bookInfo?.plantformId] ?? null) as string, [
    bookInfo,
  ]);

  const cachedList = useMemo(() => new ListCache(sourceUrl), [sourceUrl]);
  const cachedRecord = useMemo(() => new RecordCache(sourceUrl), [sourceUrl]);

  useEffect(() => {
    init();
  }, [bookInfo]);

  const updateStates = useCallback((isActive: boolean) => {
    if (!isActive) {
      cachedRecord.updateRecord({}, true);
    }
  }, []);

  useEffect(() => {
    ee.on('app-state', updateStates);
    return () => {
      ee.off('app-state', updateStates);
    };
  }, []);

  const init: any = async () => {
    try {
      openLoading('数据加载中...');
      if (sourceUrl == null) throw '书源记录获取失败...';

      setWatched(cachedRecord.getWatchedPage());

      if (!cachedList.checkIsExist()) {
        const list = await getList(sourceUrl);
        cachedList.updateList(list);
      }

      const currentChapter = cachedList.getChapterUrl(cachedRecord.getChapterPosition());
      const chapter = await getChapter(currentChapter);

      setTitle(chapter.title);
      setPages(newGetP(chapter.content));
    } catch (error) {
      Toast.fail(error.message || error);
      setTitle('加载失败');
      setPages(['加载失败啦']);
    } finally {
      closeLoading();
    }
  };

  const goToChapter = async currentChapter => {
    try {
      const chapter = await getChapter(currentChapter);

      setTitle(chapter.title);
      setPages(newGetP(chapter.content));
    } catch (error) {
      setTitle('网络异常');
      setPages(newGetP('网络异常，请稍后重试'));
    } finally {
      closeLoading();
    }
  };

  const nextChapter = async () => {
    if (sourceUrl == null) throw '书源记录获取失败...';

    const position = cachedRecord.getChapterPosition() + 1;
    if (position > cachedList.getLength()) return false;

    openLoading('数据加载中...');

    const currentChapter = cachedList.getChapterUrl(position);
    await goToChapter(currentChapter);

    cachedRecord.updateRecord({
      recordChapterNum: position,
    });

    return true;
  };

  const prevChapter = async () => {
    if (sourceUrl == null) throw '书源记录获取失败...';
    const record = getBookRecord(sourceUrl);

    const position = record.recordChapterNum - 1;

    if (position < 0) return false;

    openLoading('数据加载中...');

    const currentChapter = cachedList.getChapterUrl(position);
    await goToChapter(currentChapter);

    cachedRecord.updateRecord({
      recordChapterNum: position,
    });
    return true;
  };

  /** 只存页数，章节在翻页的时候存 */
  const saveRecord = (page: number) => {
    if (sourceUrl == null) throw '书源记录获取失败...';

    cachedRecord.updateRecord({
      recordPage: page + 1,
    });
  };

  return {
    title,
    pages,
    watched,
    showMenu,
    changeMenu,
    api: {
      nextChapter,
      prevChapter,
      saveRecord,
    },
  };
}

export default useReader;
