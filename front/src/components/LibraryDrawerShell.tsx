import { Box, Drawer } from '@chakra-ui/react';

interface LibraryDrawerShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const LibraryDrawerShell = ({ title, description, children }: LibraryDrawerShellProps) => (
  <Drawer.Content
    py={4}
    bg={{ _light: 'light.100', _dark: 'rgba(26,22,18,0.92)' }}
    backdropFilter="blur(12px)"
    borderTopRadius="2xl"
    borderWidth="1px"
    borderColor={{ _light: 'light.300', _dark: 'rgba(255,255,255,0.06)' }}
  >
    <Box
      w="40px"
      h="4px"
      borderRadius="full"
      mx="auto"
      mb={2}
      bg={{ _light: 'light.400', _dark: 'rgba(255,255,255,0.10)' }}
    />

    <Drawer.Header
      letterSpacing="tight"
      fontFamily="heading"
      fontSize="lg"
      fontWeight="semibold"
      pb={4}
    >
      {title}
    </Drawer.Header>

    {description && (
      <Drawer.Description
        px={6}
        pb={3}
        fontSize="sm"
        color={{ _light: 'brown.700', _dark: 'light.400' }}
      >
        {description}
      </Drawer.Description>
    )}

    <Drawer.Body>{children}</Drawer.Body>
  </Drawer.Content>
);

export default LibraryDrawerShell;
