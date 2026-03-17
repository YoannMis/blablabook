import { Box, Image, IconButton, Text, VStack } from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { title, averageRating, imageLinks } = book.volumeInfo;

  return (
    <VStack gap={2} align="start" minW={{ base: '140px', md: '160px' }}>
      <Box
        position="relative"
        w="100%"
        h={{ base: '210px', md: '230px' }}
        borderRadius="md"
        overflow="hidden"
      >
        <Image src={imageLinks?.thumbnail} alt={title} objectFit="cover" w="100%" h="100%" />

        {averageRating !== undefined && (
          <Box
            position="absolute"
            top={2}
            left={2}
            bg="blackAlpha.700"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
          >
            ⭐ {averageRating}
          </Box>
        )}

        <IconButton
          aria-label="Add book"
          size="xs"
          position="absolute"
          top={2}
          right={2}
          color="black"
          variant="solid"
          bg="whiteAlpha.800"
        >
          <TiPlus />
        </IconButton>
      </Box>

      <Text fontSize="sm" fontWeight="semibold" lineClamp={2}>
        {title}
      </Text>
    </VStack>
  );
};

export default BookCard;
