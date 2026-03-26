import BookCardList from './BookCardList';
import { booksMock } from '../mocks/mockData';

const LibraryAllBooks = () => {
  return <BookCardList books={booksMock} singleColumnMobile />;
};

export default LibraryAllBooks;
