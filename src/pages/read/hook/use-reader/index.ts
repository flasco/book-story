import { useState, useEffect } from 'react';
import { openLoading, closeLoading } from '@/utils';
import { newGetP } from '@/utils/text';

import { getChapter } from '@/pages/read/api';

interface ReaderParams {
  initUrl?: string;
}

function useReader(params?: ReaderParams) {
  const { initUrl = 'http://www.xinxs.la/34_34495/2266828.html' } = params ?? {};
  const [pages, setPages] = useState<any>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    openLoading('努力加载中...');
    getChapter(initUrl)
      .then(val => {
        setTitle(val.title);
        setPages(newGetP(val.content));
      })
      .finally(() => closeLoading());
  }, []);

  return {
    title,
    pages,
  };
}

export default useReader;
