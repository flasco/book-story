import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';

import { getLatestChapter, fetchAllLatest } from '@/api';
import { IBook, IBookX } from '@/definition';
import CacheBooks from '@/cache/books';
import { openLoading, closeLoading, toastFail } from '@/utils';
import ListCache from '@/cache/list';

// eslint-disable-next-line no-use-before-define
type Context = ReturnType<typeof useBookAndFlatten>;

const BookContext = React.createContext<Context>({} as Context);

interface IChanged {
  /** 章节目录url */
  catalogUrl: string;
  /** 书籍信息url，大部分情况下等于章节目录url */
  url: string;
  /** 最新章节 */
  latestChapter: string;
}

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
  /** 记录当前正在阅读的书籍 */
  const [currentBook, setCurrentBook] = useState(books?.[0] ?? {});

  useEffect(() => {
    bookCache.init().then(() => {
      const setCatalogUrl = i => {
        if (i.catalogUrl == null) i.catalogUrl = i.source[i.plantformId];
      };
      bookCache.books.forEach(setCatalogUrl);
      bookCache.flattens.forEach(setCatalogUrl);
      setBooks(bookCache.books);
      setFlattens(bookCache.flattens);
    });
  }, []);

  const getExistBook = useCallback(
    (book: IBookX) => {
      if (!book) return null;
      const isEQ = x => x.author === book.author && x.bookName === book.bookName;
      let curBook = books.find(isEQ);
      if (curBook) return curBook;
      curBook = flattens.find(isEQ);
      if (curBook) return curBook;
      return null;
    },
    [books, flattens]
  );

  const deleteBook = useCallback(
    (index: number) => {
      const book = books[index];
      bookCache.deleteBookWithCache(book);
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
        toastFail({ text: '书源获取失败，疑似污染数据...' });
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

  const changeOrigin = (changed: IChanged) => {
    const { catalogUrl, url: latestUrl } = changed;
    const curPtr = books.findIndex(i => i.catalogUrl === currentBook.catalogUrl);
    console.log(curPtr);
    if (curPtr < 0) return false;
    const book = books[curPtr];
    book.catalogUrl = catalogUrl;
    const plantformId = book.source.findIndex(i => i === latestUrl);
    book.plantformId = plantformId;
    setBooks([...books]);

    // eslint-disable-next-line no-use-before-define
    setCurBook(book);

    bookCache.update({ books: [...books] });
    return true;
  };

  const setCurBook = useCallback(
    book => {
      if (book) setCurrentBook({ ...book });
    },
    [setCurrentBook]
  );

  const clickBookToRead = useCallback(
    (index: number) => {
      books[index].latestRead = Date.now();
      books[index].isUpdate = false;
      books[index].updateNum = 0;
      setCurBook(books[index]);
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
    const func = (i: IBook) => ({
      title: i.latestChapter,
      url: i.source[i.plantformId],
      catalogUrl: i.catalogUrl,
    });
    const task1 = books.map(func);
    const task2 = flattens.map(func);
    const [t1, t2] = await Promise.all([fetchAllLatest(task1), fetchAllLatest(task2)]);

    let cnt = 0;
    let flattened = 0;
    t1.forEach((item, index) => {
      if (item !== null) {
        const sourceUrl = books[index].catalogUrl;
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
      if (item !== null) {
        const sourceUrl = flattens[index].catalogUrl;
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
    setCurBook,
    getExistBook,
    updateLists,
    changeOrigin,
  };

  return { flattens, books, api, currentBook };
};

export const BookProvider: React.FC = ({ children }) => {
  const value = useBookAndFlatten();

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = () => {
  return useContext(BookContext);
};
