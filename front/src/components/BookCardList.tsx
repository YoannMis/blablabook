import { Box, Text, HStack } from '@chakra-ui/react';
import BookCard from './BookCard';

interface BookCardListProps {
  title: string;
  books: Book[];
}

const BookCardList = ({ title, books }: BookCardListProps) => (
  <Box overflowX="auto">
    <Text fontWeight="bold" mb={2}>
      {title}
    </Text>
    <HStack gap={6} flexWrap="nowrap" align="stretch">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </HStack>
  </Box>
);

export default BookCardList;
