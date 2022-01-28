import { getBooksWithType, setBooksWithType } from '@/storage/book';
import { removeItem } from '@/storage/base';

import { IBook } from '@/definition';

interface IUpdate {
  books?: IBook[];
  flattens?: IBook[];
}

class BookCache {
  books: IBook[] = [];
  flattens: IBook[] = [];

  init = async () => {
    this.books = (await getBooksWithType('books')) ?? [];
    this.flattens = (await getBooksWithType('flattens')) ?? [];
  };

  /** 清理书籍相关缓存 */
  deleteBookCache = (book: IBook) => {
    const listKey = 'list@' + book.catalogUrl;
    const chaptersKey = 'chapter@' + book.catalogUrl;
    const imgKey = book.img;
    removeItem(imgKey);
    removeItem(listKey);
    removeItem(chaptersKey);
  };

  update = ({ books, flattens }: IUpdate) => {
    if (flattens != null) {
      this.flattens = flattens;
      setBooksWithType('flattens', flattens);
    }
    if (books != null) {
      this.books = books;
      setBooksWithType('books', books);
    }
  };

  get = () => ({
    books: this.books,
    flattens: this.flattens,
  });
}

export default BookCache;
