import React, { type ReactNode } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

type PageLayoutProps = {
  imageSrc: string;
  children: ReactNode;
  header?: ReactNode;
  imagePosition?: 'top' | 'left';
  imageSize?: string;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  imageSrc,
  header,
  imagePosition = 'top',
  imageSize = '20%',
  children,
}) => {
  const isRow = imagePosition === 'left';

  return (
    <Flex direction={{ base: 'column', md: isRow ? 'row' : 'column' }} width="100%" height="100vh">
      <Box
        flexShrink={0}
        width={isRow ? imageSize : '100%'}
        height={isRow ? '100%' : imageSize}
        position="relative"
      >
        <Image src={imageSrc} alt="Page image" objectFit="cover" width="100%" height="100%" />

        <Box position="absolute" inset={0}>
          {header}
        </Box>
      </Box>

      <Box flex="1" padding={{ base: 4, md: 8 }}>
        {children}
      </Box>
    </Flex>
  );
};
