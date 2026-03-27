import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLibrary } from '../context/LibraryContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import { Box } from '@chakra-ui/react';
import BookCardList from './BookCardList';
import { slugify } from '../utils/stringUtils';

const getStatusFromSlug = (slug: string, t: any) => {
  const map: Record<string, string> = {
    [slugify(t('library.collections.read'))]: 'read',
    [slugify(t('library.collections.wishlist'))]: 'wishlist',
  };

  return Object.entries(map).find(([key]) => key === slug)?.[1];
};

const LibraryCollectionDetails = () => {
  const { t, i18n } = useTranslation('book');
  const { collection: slug } = useParams<{ collection: string }>();
  const { getCollection, fetchNextPage } = useLibrary();

  const status = slug ? getStatusFromSlug(slug, t) : undefined;
  const collectionKey = status ? `collections:${status}` : null;
  const booksCollection = collectionKey ? getCollection(collectionKey) : null;

  useEffect(() => {
    if (!booksCollection || !collectionKey || !status) return;

    if (booksCollection.items.length === 0 && booksCollection.hasNext && !booksCollection.loading) {
      fetchNextPage(collectionKey, status);
    }
  }, [collectionKey, status, i18n.language]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => {
      if (!collectionKey || !status) return;
      fetchNextPage(collectionKey, status);
    },
    hasNext: booksCollection?.hasNext ?? false,
    loading: booksCollection?.loading ?? false,
  });

  const books = booksCollection ? booksCollection.items.map((collection) => collection.book) : [];

  if (!booksCollection) {
    return <p>{t('library.empty')}</p>;
  }

  return (
    <Box w="100%">
      {booksCollection.loading && booksCollection.items.length === 0 ? (
        <BookCardList books={[]} singleColumnMobile isLoading />
      ) : booksCollection.items.length === 0 ? (
        <p>{t('library.empty')}</p>
      ) : (
        <>
          <BookCardList books={books} singleColumnMobile isLoading={booksCollection.loading} />
          <div ref={sentinelRef} />
        </>
      )}
    </Box>
  );
};

export default LibraryCollectionDetails;
