import { useState, useEffect, useMemo, useCallback } from 'react';
import { Toast } from 'antd-mobile';

import { openLoading, closeLoading } from '@/utils';
import { newGetP } from '@/utils/text';
import { getChapterList, getBookRecord, updateChapterList, updateBookRecord } from '@/storage/book';

import { getChapter, getList } from '@/pages/read/api';
import { IBook } from '@/defination';

/**
 * 书籍进度存储key约定 record@${sourceUrl}
 * 书籍列表存储key约定 list@${sourceUrl}
 * 书籍章节存储key约定 chapter@${sourceUrl}
 */

function useReader(bookInfo?: IBook) {
  const [pages, setPages] = useState<any>([]);
  const [title, setTitle] = useState('');
  const [watched, setWatched] = useState(4);
  const [showMenu, setShow] = useState(false);

  const changeMenu = useCallback(() => setShow(!showMenu), [showMenu]);

  const sourceUrl = useMemo(() => (bookInfo?.source[bookInfo?.plantformId] ?? null) as string, [
    bookInfo,
  ]);

  useEffect(() => {
    init();
  }, [bookInfo]);

  const init: any = async () => {
    try {
      openLoading('数据加载中...');
      if (sourceUrl == null) throw '书源记录获取失败...';

      let list = getChapterList(sourceUrl);
      const record = getBookRecord(sourceUrl);
      setWatched(record.recordPage);

      if (list == null) {
        list = await getList(sourceUrl);
        updateChapterList(sourceUrl, list);
      }

      const currentChapter = list[record.recordChapterNum].url;
      const chapter = await getChapter(currentChapter);

      setTitle(chapter.title);
      setPages(newGetP(chapter.content));
    } catch (error) {
      Toast.fail(error.message || error);
      setTitle('');
      setPages([]);
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
    const list = getChapterList(sourceUrl);
    const record = getBookRecord(sourceUrl);

    const position = record.recordChapterNum + 1;
    if (position > list.length) return false;

    openLoading('数据加载中...');

    const currentChapter = list[position].url;
    await goToChapter(currentChapter);

    updateBookRecord(sourceUrl, {
      ...record,
      recordChapterNum: position,
    });
    return true;
  };

  const prevChapter = async () => {
    if (sourceUrl == null) throw '书源记录获取失败...';
    const list = getChapterList(sourceUrl);
    const record = getBookRecord(sourceUrl);

    const position = record.recordChapterNum - 1;

    if (position < 0) return false;

    openLoading('数据加载中...');

    const currentChapter = list[position].url;
    await goToChapter(currentChapter);

    updateBookRecord(sourceUrl, {
      ...record,
      recordChapterNum: position,
    });
    return true;
  };

  const saveRecord = (currentChapter, page) => {
    if (sourceUrl == null) throw '书源记录获取失败...';
    const list = getChapterList(sourceUrl);

    const pos = list.findIndex(i => i.url === currentChapter);

    updateBookRecord(sourceUrl, {
      recordChapterNum: pos,
      recordPage: page,
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
