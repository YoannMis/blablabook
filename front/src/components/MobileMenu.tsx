import { Flex } from '@chakra-ui/react';
import NavLink from './NavLink';
import { IoTelescopeSharp } from 'react-icons/io5';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';

const MobileMenu = () => {
  return (
    <Flex
      as="nav"
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="grey"
      justify="space-around"
      p={4}
    >
      <NavLink to="/" icon={<IoTelescopeSharp />} vertical>
        Découvrir
      </NavLink>
      <NavLink to="/library" icon={<TbBookFilled />} vertical>
        Bibliothèque
      </NavLink>
      <NavLink to="/login" icon={<BsPersonCircle />} vertical>
        Se connecter
      </NavLink>
    </Flex>
  );
};

export default MobileMenu;
