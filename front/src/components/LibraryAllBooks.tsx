import BookCardList from './BookCardList';
import { useEffect, useState } from 'react';
import { axiosAuth } from '../utils/axiosAuth';
import type { UserBook } from '../types/book';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LibraryAllBooks = () => {
  const { t } = useTranslation('book');
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

  return (
    <Box w="100%">
      {userBooks.length === 0 && !loading ? (
        <p>{t('library.empty', "Vous n'avez pas encore de livres dans votre blibliothèque !")}</p>
      ) : (
        <BookCardList books={books} singleColumnMobile isLoading={loading} />
      )}
    </Box>
  );
};

export default LibraryAllBooks;
