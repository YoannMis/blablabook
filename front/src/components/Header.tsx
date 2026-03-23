import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';

import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <Flex align="center" p={4}>
      <Box flex="1" display={{ base: 'none', md: 'block' }} />

      <Box flex="1" textAlign="center">
        <Text fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} color="white">
          BlablaBook
        </Text>
      </Box>

      <HStack flex="1" justify="flex-end" gap={6} display={{ base: 'none', md: 'flex' }}>
        <ThemeToggle />
        <NavLink to="/" icon={LiaCompass}>
          Découvrir
        </NavLink>
        <NavLink to="/library" icon={TbBookFilled}>
          Bibliothèque
        </NavLink>
        <NavLink to="/login" icon={BsPersonCircle}>
          <Text whiteSpace="nowrap">Se connecter</Text>
        </NavLink>
      </HStack>
    </Flex>
  );
};

export default Header;
