import { getBooksWithType, setBooksWithType } from '@/storage/book';
import { IBook } from '@/defination';

interface IUpdate {
  books?: IBook[];
  flattens?: IBook[];
}

class ListCache {
  books: IBook[] = [];
  flattens: IBook[] = [];

  init = async () => {
    this.books = (await getBooksWithType('books')) ?? [];
    this.flattens = (await getBooksWithType('flattens')) ?? [];
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

export default ListCache;
