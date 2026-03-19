import { Flex, HStack, Text } from '@chakra-ui/react';
import { IoTelescopeSharp } from 'react-icons/io5';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';

import NavLink from './NavLink';

const Header = () => {
  return (
    <Flex direction="column" height="100%">
      <Flex justify="flex-end" p={4}>
        <HStack display={{ base: 'none', md: 'flex' }} gap={6}>
          <NavLink to="/" icon={<IoTelescopeSharp />}>
            Découvrir
          </NavLink>
          <NavLink to="/library" icon={<TbBookFilled />}>
            Bibliothèque
          </NavLink>
          <NavLink to="/login" icon={<BsPersonCircle />}>
            Se connecter
          </NavLink>
        </HStack>
      </Flex>

      <Flex flex="1" align="center" justify="center">
        <Text fontSize={{ base: '2xl', md: '4xl', lg: '6xl' }} color="white" textAlign="center">
          BlablaBook
        </Text>
      </Flex>
    </Flex>
  );
};

export default Header;
