import { Box, HStack, Stack, Circle, Heading } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

const LibraryCollections = () => {
  const cardBg = useColorModeValue('light.200', 'gray.800');
  const cardHover = useColorModeValue('light.300', 'brown.800');
  const textColor = useColorModeValue('brown.900', 'light.50');
  const circleBg = useColorModeValue('brown.400', 'brown.600');
  const circleTextColor = useColorModeValue('light.50', 'light.50');

  const collections = [
    { label: 'À lire', count: 12 },
    { label: 'Envie de lire', count: 8 },
  ];

  return (
    <Stack gap={6} p={4}>
      {collections.map(({ label, count }) => (
        <Box
          key={label}
          bg={cardBg}
          _hover={{ bg: cardHover, cursor: 'pointer' }}
          borderRadius="xl"
          p={6}
          shadow="md"
          transition="background 0.2s"
        >
          <HStack justifyContent="space-between">
            <Heading fontSize="xl" fontWeight="bold" color={textColor}>
              {label}
            </Heading>
            <Circle size="40px" bg={circleBg} color={circleTextColor} fontWeight="bold">
              {count}
            </Circle>
          </HStack>
        </Box>
      ))}
    </Stack>
  );
};

export default LibraryCollections;
