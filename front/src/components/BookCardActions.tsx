import { Box } from '@chakra-ui/react';

import type { Book } from '../types/book';
import BookDotsMenu from './BookDotsMenu';
import AddBookActions from './AddBookActions';

type Mode = 'default' | 'libraryDesktop' | 'libraryMobile';

interface BookCardActionsProps {
  mode: Mode;
  book: Book;
}

const BookCardActions = ({ mode, book }: BookCardActionsProps) => {
  if (mode === 'default') {
    return <AddBookActions book={book} />;
  }

  if (mode === 'libraryDesktop') {
    return (
      <Box
        position="absolute"
        top={2}
        right={2}
        bg={{ _light: 'rgba(255,255,255,0.75)', _dark: 'rgba(0,0,0,0.55)' }}
        backdropFilter="blur(12px)"
        borderRadius="full"
        px={1}
        py={1}
        borderWidth="1px"
        borderColor={{ _light: 'rgba(0,0,0,0.10)', _dark: 'rgba(255,255,255,0.10)' }}
        boxShadow={{ _light: '0 4px 10px rgba(0,0,0,0.08)', _dark: 'none' }}
      >
        <BookDotsMenu />
      </Box>
    );
  }

  return null;
};

export default BookCardActions;
