import { Flex } from '@chakra-ui/react';
import NavLink from './NavLink';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const links = [
  { to: '/', i18nKey: 'nav.discover', icon: LiaCompass },
  { to: '/library', i18nKey: 'nav.library', icon: TbBookFilled },
  { to: '/login', i18nKey: 'nav.login', icon: BsPersonCircle },
];

const MobileMenu = () => {
  const { t } = useTranslation('common');

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
      {links.map(({ to, i18nKey, icon }) => (
        <NavLink key={to} to={to} icon={icon} vertical>
          {t(i18nKey)}
        </NavLink>
      ))}
    </Flex>
  );
};

export default MobileMenu;
