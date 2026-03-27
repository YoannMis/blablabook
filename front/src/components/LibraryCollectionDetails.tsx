import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { UserBook } from '../types/book';
import { useTranslation } from 'react-i18next';
import { slugify } from '../utils/stringUtils';
import { axiosAuth } from '../utils/axiosAuth';
import BookCardList from './BookCardList';
import { Box } from '@chakra-ui/react';

const LibraryCollectionDetails = () => {
  const { t, i18n } = useTranslation('book');
  const { collection } = useParams<{ collection: string }>();
  const [collectionBooks, setCollectionBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugToStatus: Record<string, string> = {
    [slugify(t('library.collections.read'))]: 'read',
    [slugify(t('library.collections.wishlist'))]: 'wishlist',
  };
  useEffect(() => {
    const fetchCollection = async () => {
      if (!collection) return;

      const status = slugToStatus[collection];

      if (!status) {
        setError('Collection not found');
        return;
      }

      try {
        setLoading(true);
        const { data } = await axiosAuth.get('/api/library', { params: { status } });
        setCollectionBooks(data.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [name, i18n.language]);

  const books = collectionBooks.map((collectionBook) => collectionBook.book);

  return (
    <Box w="100%">
      {!loading &&
        !error &&
        (collectionBooks.length === 0 ? (
          <p>{t('library.empty')}</p>
        ) : (
          <BookCardList books={books} singleColumnMobile isLoading={loading} />
        ))}
    </Box>
  );
};

export default LibraryCollectionDetails;
