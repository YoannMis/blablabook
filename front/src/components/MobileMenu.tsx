import { Flex } from '@chakra-ui/react';
import NavLink from './NavLink';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';

const links = [
  { to: '/', label: 'Découvrir', icon: LiaCompass },
  { to: '/library', label: 'Bibliothèque', icon: TbBookFilled },
  { to: '/login', label: 'Se connecter', icon: BsPersonCircle },
];

const MobileMenu = () => {
  return (
    <Flex
      as="nav"
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={{ _light: 'light.50', _dark: 'brown.800' }}
      borderTop={{
        _light: '1px solid var(--chakra-colors-light-200)',
        _dark: '1px solid var(--chakra-colors-brown-600)',
      }}
      justify="space-around"
      py={3}
    >
      {links.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} icon={icon} vertical>
          {label}
        </NavLink>
      ))}
    </Flex>
  );
};

export default MobileMenu;
