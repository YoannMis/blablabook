import { Box, Heading, Separator, SimpleGrid } from '@chakra-ui/react';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import type { Book } from '../types/book';

interface BookCardListProps {
  title?: string;
  books: Book[];
  wrap?: boolean;
  isLoading?: boolean;
  singleColumnMobile?: boolean;
}

const BookCardList = ({
  title,
  books,
  wrap = true,
  isLoading = false,
  singleColumnMobile = false,
}: BookCardListProps) => {
  const skeletonCount = 6;

  const minChildWidth = { base: singleColumnMobile ? '100%' : '140px', md: '150px' };
  const boxWidth = { base: singleColumnMobile ? '100%' : '150px', md: 'auto' };

  const renderSkeletons = () =>
    Array.from({ length: skeletonCount }).map((_, index) => (
      <BookCardSkeleton key={index} wrap={wrap} />
    ));

  const renderBooks = () =>
    books.map((book) => (
      <Box key={book.id} w={boxWidth}>
        <Separator display={{ base: 'block', md: 'none' }} my={4} />
        <BookCard book={book} />
      </Box>
    ));

  const content = isLoading ? renderSkeletons() : renderBooks();

  return (
    <Box overflowX={wrap ? 'visible' : 'auto'} mb={6}>
      {title && (
        <Heading size="xl" fontWeight="bold" mb={4}>
          {title}
        </Heading>
      )}

      {wrap ? (
        <SimpleGrid minChildWidth={minChildWidth} gap={6}>
          {content}
        </SimpleGrid>
      ) : (
        <Box display="flex" gap={6} py={2}>
          {content}
        </Box>
      )}
    </Box>
  );
};

export default BookCardList;
