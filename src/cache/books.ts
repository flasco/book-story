import { getBooksWithType, setBooksWithType } from '@/storage/book';
import { IBook } from '@/defination';

interface IUpdate {
  books?: IBook[];
  flattens?: IBook[];
}

class ListCache {
  books: IBook[] = getBooksWithType('books') ?? [];
  flattens: IBook[] = getBooksWithType('flattens') ?? [];

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

export default ListCache;
