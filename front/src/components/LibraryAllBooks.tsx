import BookCardList from './BookCardList';
import { useEffect, useState } from 'react';
import { axiosAuth } from '../utils/axiosAuth';
import type { UserBook } from '../types/book';

const LibraryAllBooks = () => {
  const [loading, setLoading] = useState(false);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      setLoading(true);
      try {
        const { data } = await axiosAuth.get('/api/library');
        setUserBooks(data.data);
      } catch (error) {
        console.error('Failed to fetch user library:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  const books = userBooks.map((userBook) => userBook.book);

  return <BookCardList books={books} singleColumnMobile isLoading={loading} />;
};

export default LibraryAllBooks;
