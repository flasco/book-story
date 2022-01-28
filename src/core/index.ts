import create from 'zustand';

import CacheBooks from '@/cache/books';
import { IBook, IBookX } from '@/definition';

interface IBookSource {
  bookCache: CacheBooks;
  books: IBook[];
  flattens: IBook[];
}

export const useStore = create<IBookSource>((set, get) => ({
  bookCache: new CacheBooks(),
  books: [],
  flattens: [],

  initial: async () => {
    const { bookCache } = get();
    await bookCache.init();
    const setCatalogUrl = (i: IBook) => {
      if (i.catalogUrl == null) {
        i.catalogUrl = i.source[i.plantformId];
      }
    };
    bookCache.books.forEach(setCatalogUrl);
    bookCache.flattens.forEach(setCatalogUrl);
    set({ books: bookCache.books, flattens: bookCache.flattens });
  },

  getExistBook: (book: IBookX) => {
    const { books, flattens } = get();
    const isEQ = (x: IBookX) => x.author === book.author && x.bookName === book.bookName;
    let curBook = books.find(isEQ);
    if (curBook) {
      return curBook;
    }
    curBook = flattens.find(isEQ);
    if (curBook) {
      return curBook;
    }
    return null;
  },

  deleteBook: (index: number) => {
    const { books } = get();
    // bookCache.deleteBook(book);
    books.splice(index, 1);
    set({ books: [...books] });
    // bookCache.update({ books });
  },

  moveToFlattens: (index: number) => {
    const { books, flattens } = get();
    const book = books.splice(index, 1)[0];
    flattens.unshift(book);
    set({ books: [...books], flattens: [...flattens] });
  },
}));

// TODO: 可以在这里去做bookCache的状态同步
useStore.subscribe(state => {
  console.log(state);
});
