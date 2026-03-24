import { Box, VStack, HStack } from '@chakra-ui/react';
import BookCard from './BookCard';

interface CollectionListProps {
  books: Book[];
}

const CollectionList = ({ books }: CollectionListProps) => (
  <Box>
    <HStack display={{ base: 'none', md: 'flex' }} flexWrap="wrap" gap={6} align="stretch">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </HStack>
    <VStack display={{ md: 'none' }} gap={6} align="stretch">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </VStack>
  </Box>
);

export default CollectionList;
