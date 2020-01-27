import React, { useState, useCallback, useMemo, useContext } from 'react';

import { getLatestChapter } from '@/api';
import { IBook, IBookX } from '@/defination';
import { openLoading, closeLoading } from '@/utils';
import { Toast } from 'antd-mobile';

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
  };
}
const BookContext = React.createContext<Context>({} as Context);

const useBookAndFlatten = () => {
  const [books, setBooks] = useState<IBook[]>([
    {
      bookName: '天醒之路',
      author: '蝴蝶蓝',
      img: 'https://www.xinxs.la/BookFiles/BookImages/64.jpg',
      desc:
        '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
      latestChapter: '上架感言!',
      plantformId: 1,
      latestRead: 0,
      isUpdate: false,
      updateNum: 0,
      source: {
        '1': 'https://www.xinxs.la/0_64/',
        '2': 'http://www.kanshuzhong.com/book/36456/',
      },
    },
    {
      bookName: '玩家凶猛',
      author: '黑灯夏火',
      latestChapter: '上架感言!',
      desc:
        '这是超越维度的真实游戏，\n　　这是诸天万界的激烈竞争，\n　　波澜壮阔的史诗神话，\n　　离奇曲折的异界幻想，\n　　玩家凶猛！',
      img: 'https://www.xinxs.la/BookFiles/BookImages/wanjiaxiongmeng.jpg',
      plantformId: 1,
      latestRead: 0,
      isUpdate: false,
      updateNum: 0,
      source: { '1': 'https://www.xinxs.la/465_465129/' },
    },
  ] as any);
  const [flattens, setFlattens] = useState<IBook[]>([]);

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
    },
    [books]
  );

  const moveToFlattens = useCallback(
    (index: number) => {
      const book = books.splice(index, 1)[0];
      flattens.unshift(book);
      setBooks(books);
      setFlattens(flattens);
    },
    [books, flattens]
  );

  const moveToBooks = useCallback(
    (index: number) => {
      const book = flattens.splice(index, 1)[0];
      book.latestRead = Date.now();

      books.unshift(book);
      setBooks(books);
      setFlattens(flattens);
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
    },
    [books]
  );

  const clickBookToRead = useCallback(
    (index: number) => {
      books[index].latestRead = Date.now();
      setBooks(books);
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
  }, [books]);

  const api = {
    insertBook,
    deleteBook,
    sortBookWithStamp,
    moveToBooks,
    moveToFlattens,
    clickBookToRead,
    isExistBook,
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
