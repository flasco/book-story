import React, { useState, useCallback, useMemo, useContext } from 'react';
import { IBook } from '@/defination';

interface Context {
  books: IBook[];
  flattens: IBook[];
  api: {
    insertBook: (data: IBook) => void;
    deleteBook: (index: number) => void;
    sortBookWithStamp: () => void;
    moveToBooks: (index: number) => void;
    moveToFlattens: (index: number) => void;
    clickBookToRead: (index: number) => void;
  };
}
const BookContext = React.createContext<Context>({} as any);

const useBookAndFlatten = () => {
  const [books, setBooks] = useState<IBook[]>([{ bookName: '213' }, { bookName: '456' }] as any);
  const [flattens, setFlattens] = useState<IBook[]>([]);

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
      book.latestStamp = Date.now();

      books.unshift(book);
      setBooks(books);
      setFlattens(flattens);
    },
    [books, flattens]
  );

  /** 传入的book只有baseInfo，operatorInfo需要在这里插入 */
  const insertBook = useCallback(
    (book: IBook) => {
      book.latestStamp = Date.now();

      books.unshift(book);
      setBooks([...books]);
    },
    [books]
  );

  const clickBookToRead = useCallback(
    (index: number) => {
      books[index].latestStamp = Date.now();
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
      while (preIndex >= 0 && arr[preIndex].latestStamp < current.latestStamp) {
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
