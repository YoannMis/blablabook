import { Box, Text, Image, IconButton, Heading, Flex, Show } from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';
import { useNavigate, useLocation } from 'react-router';
import { slugify } from '../utils/stringUtils';
import noBookCover from '../assets/noBookCover.jpg';
import { useTranslation } from 'react-i18next';

import BookDotsMenu from './BookDotsMenu';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const { title, authors, averageRating, imageLinks, categories } = book;

  const firstCategory = categories?.[0] ?? 'uncategorized';
  const slugCategory = slugify(firstCategory);

  const handleClick = () => {
    navigate(`/books/${slugCategory}/${book.id}`);
  };

  return (
    <Flex
      role="group"
      position="relative"
      direction={pathname === '/library' ? { base: 'row', md: 'column' } : 'column'}
      gapX={6}
      gapY={3}
      align={{ base: 'center', md: 'start' }}
      minW={{ base: '140px', md: '160px' }}
      cursor="pointer"
    >
      <Box
        position="relative"
        h={{ base: '220px', md: '260px' }}
        borderRadius="xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.100"
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
        }}
      >
        <Image
          src={imageLinks?.thumbnail || noBookCover}
          alt={title}
          objectFit="fill"
          w="100%"
          h="100%"
          onClick={handleClick}
        />

        {averageRating !== undefined && (
          <Box
            position="absolute"
            top={2}
            left={2}
            bg="whiteAlpha.900"
            color="blackAlpha.800"
            backdropFilter="blur(6px)"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="medium"
          >
            ⭐ {averageRating}
          </Box>
        )}

        {pathname === '/library' ? (
          <Box
            aria-label={'Voir les actions disponibles pour ce livre'}
            display={{ base: 'none', md: 'block' }}
            position="absolute"
            top={2}
            right={2}
            bg="whiteAlpha.800"
            backdropFilter="blur(6px)"
            color="blackAlpha.800"
            px={1}
            py={1}
            borderRadius="xl"
          >
            <BookDotsMenu />
          </Box>
        ) : (
          <IconButton
            aria-label={t('bookCard.addBook')}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            variant="ghost"
            bg="whiteAlpha.800"
            backdropFilter="blur(6px)"
          >
            <TiPlus color="black" />
          </IconButton>
        )}
      </Box>

      <Box textAlign="left">
        <Heading size={{ base: 'md', md: 'sm' }} fontWeight="medium" lineClamp={2}>
          {title}
        </Heading>
        <Show when={pathname === '/library'}>
          <Text fontSize={{ base: 'md', md: 'sm' }}>{authors?.join(', ')}</Text>
        </Show>
      </Box>
      {pathname === '/library' && (
        <Box display={{ base: 'block', md: 'none' }} position="absolute" top={3} right={2}>
          <BookDotsMenu />
        </Box>
      )}
    </Flex>
  );
};

export default BookCard;
