import { Box, VStack } from '@chakra-ui/react';
import BookCard from './BookCard';

interface CollectionListProps {
  books: Book[];
}

const CollectionList = ({ books }: CollectionListProps) => (
  <Box>
    <VStack gap={6} align="stretch">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </VStack>
  </Box>
);

export default CollectionList;
