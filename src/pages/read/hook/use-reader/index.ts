import { useState, useEffect } from 'react';
import { Toast } from 'antd-mobile';

import { openLoading, closeLoading } from '@/utils';
import { newGetP } from '@/utils/text';
import { getChapterList, getBookRecord, updateChapterList } from '@/storage/book';

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
  const [watched, setWatched] = useState(1);

  useEffect(() => {
    init();
  }, [bookInfo]);

  const init: any = async () => {
    try {
      openLoading('数据加载中...');
      if (bookInfo == null) throw '书籍信息获取失败...';

      const sourceUrl = (bookInfo?.source[bookInfo?.plantformId] ?? null) as string;
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
      closeLoading();
    } catch (error) {
      closeLoading();
      Toast.fail(error.message || error);
      setTitle('');
      setPages([]);
    }
  };

  return {
    title,
    pages,
    watched,
  };
}

export default useReader;
