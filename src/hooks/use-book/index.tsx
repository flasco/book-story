import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';

import { getLatestChapter, fetchAllLatest } from '@/api';
import { IBook, IBookX } from '@/defination';
import CacheBooks from '@/cache/books';
import { openLoading, closeLoading } from '@/utils';
import { Toast } from 'antd-mobile';
import ListCache from '@/cache/list';

interface Context {
  books: IBook[];
  flattens: IBook[];
  api: {
    insertBook: (data: IBookX) => void;
    deleteBook: (index: number) => void;
    sortBookWithStamp: () => void;
    moveToBooks: (index: number) => void;
    moveToFlattens: (index: number) => void;
    clickBookToRead: (index: number) => void;
    isExistBook: (book: IBookX) => boolean;
    updateLists: () => Promise<any>;
  };
}
const BookContext = React.createContext<Context>({} as Context);

const getUpdateNum = (list, latestChapter) => {
  const length = list.length;
  for (let i = length - 1; i >= 0; i--) {
    if (list[i].title === latestChapter) {
      return length - i - 1;
    }
  }
  return 0;
};

const useBookAndFlatten = () => {
  const bookCache = useMemo(() => new CacheBooks(), []);
  const [books, setBooks] = useState<IBook[]>([]);
  const [flattens, setFlattens] = useState<IBook[]>([]);

  useEffect(() => {
    bookCache.init().then(() => {
      setBooks(bookCache.books);
      setFlattens(bookCache.flattens);
    });
  }, []);

  const isExistBook = useCallback(
    (book: IBookX) => {
      const isEQ = x => x.author === book.author && x.bookName === book.bookName;
      return books.some(isEQ) || flattens.some(isEQ);
    },
    [books, flattens]
  );

  const deleteBook = useCallback(
    (index: number) => {
      books.splice(index, 1);
      setBooks([...books]);
      bookCache.update({ books });
    },
    [books]
  );

  const moveToFlattens = useCallback(
    (index: number) => {
      const book = books.splice(index, 1)[0];
      flattens.unshift(book);
      setBooks([...books]);
      setFlattens([...flattens]);
      bookCache.update({ books, flattens });
    },
    [books, flattens]
  );

  const moveToBooks = useCallback(
    (index: number) => {
      const book = flattens.splice(index, 1)[0];
      book.latestRead = Date.now();

      books.unshift(book);
      setBooks([...books]);
      setFlattens([...flattens]);
      bookCache.update({ books, flattens });
    },
    [books, flattens]
  );

  /** 传入的book只有baseInfo，operatorInfo需要在这里插入 */
  const insertBook = useCallback(
    async (book: IBookX) => {
      const sourceUrl = book.source[book.plantformId] ?? '';

      if (sourceUrl === '') {
        Toast.fail('书源获取失败，疑似污染数据...');
        return;
      }
      openLoading('请求数据中...');
      const latestChapter = await getLatestChapter(sourceUrl);
      closeLoading();

      const newBook: IBook = {
        ...book,
        latestChapter,
        latestRead: Date.now(),
        updateNum: 0,
        isUpdate: false,
      };

      books.unshift(newBook);
      setBooks([...books]);
      bookCache.update({ books });
    },
    [books]
  );

  const clickBookToRead = useCallback(
    (index: number) => {
      books[index].latestRead = Date.now();
      books[index].isUpdate = false;
      books[index].updateNum = 0;
      setBooks([...books]);
    },
    [books]
  );

  const sortBookWithStamp = useCallback(() => {
    let preIndex: any, current: any;
    const arr = [...books];
    for (let i = 1, len = arr.length; i < len; i++) {
      preIndex = i - 1;
      current = arr[i];
      while (preIndex >= 0 && arr[preIndex].latestRead < current.latestRead) {
        arr[preIndex + 1] = arr[preIndex];
        preIndex--;
      }
      arr[preIndex + 1] = current;
    }
    setBooks(arr);
    bookCache.update({ books });
  }, [books]);

  const updateLists = useCallback(async () => {
    const func = (i: IBook) => ({ title: i.latestChapter, url: i.source[i.plantformId] });
    const task1 = books.map(func);
    const task2 = flattens.map(func);
    const [t1, t2] = await Promise.all([fetchAllLatest(task1), fetchAllLatest(task2)]);

    let cnt = 0;
    let flattened = 0;
    t1.forEach((item, index) => {
      if (item !== '-1') {
        const sourceUrl = books[index].source[books[index].plantformId];
        const cacheList = new ListCache(sourceUrl);
        cacheList.updateList(item.list);
        cnt++;
        books[index].latestChapter = item.title;
        const num = getUpdateNum(item.list, books[index].latestChapter);
        books[index].isUpdate = true;
        books[index].updateNum += num;
      }
    });

    t2.forEach((item, index) => {
      if (item !== '-1') {
        const sourceUrl = flattens[index].source[flattens[index].plantformId];
        const cacheList = new ListCache(sourceUrl);
        cacheList.updateList(item.list);
        flattens[index].latestChapter = item.title;
        const num = getUpdateNum(item.list, flattens[index].latestChapter);
        flattens[index].isUpdate = true;
        flattens[index].updateNum += num;
      }
      if (flattens[index].updateNum > 30) flattened++;
    });

    setBooks([...books]);
    setFlattens([...flattens]);
    bookCache.update({ books, flattens });
    return { cnt, flattened };
  }, [books, flattens]);

  const api = {
    insertBook,
    deleteBook,
    sortBookWithStamp,
    moveToBooks,
    moveToFlattens,
    clickBookToRead,
    isExistBook,
    updateLists,
  };

  return { flattens, books, api };
};

export const BookProvider: React.FC = ({ children }) => {
  const { flattens, books, api } = useBookAndFlatten();

  const value = useMemo(
    () => ({
      books,
      flattens,
      api,
    }),
    [books, flattens]
  );
  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = () => {
  return useContext(BookContext);
};
