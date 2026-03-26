import { Show, Box, Flex, HStack, Text } from '@chakra-ui/react';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';
import { useLocation } from 'react-router';

import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { t } = useTranslation('common');
  const { user, isLoggedIn } = useCurrentUser();
  const { pathname } = useLocation();

  return (
    <>
      <Flex align="center" p={4}>
        <Box flex="1" display={{ base: 'none', md: 'block' }} />

        <Box flex="1" textAlign="center">
          <Text fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} color="white">
            BlablaBook
          </Text>
        </Box>

        <HStack>
          <Box display={{ base: 'block', md: 'block' }} ml={{ base: 2, md: 0 }}>
            <ThemeToggle />
          </Box>

          <HStack flex="1" justify="flex-end" gap={6} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/" icon={LiaCompass}>
              {t('nav.discover')}
            </NavLink>
            <NavLink to="/library" icon={TbBookFilled}>
              {t('nav.library')}
            </NavLink>
            {isLoggedIn ? (
              <NavLink to="/account" icon={BsPersonCircle}>
                <Text whiteSpace="nowrap">{user?.username}</Text>
              </NavLink>
            ) : (
              <NavLink to="/login" icon={BsPersonCircle}>
                <Text whiteSpace="nowrap">{t('nav.login')}</Text>
              </NavLink>
            )}
          </HStack>
        </HStack>
      </Flex>
      <Box textAlign="center">
        <Show when={pathname === '/library'}>
          <Text fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} color="white">
            Ma bibliothèque
          </Text>
        </Show>
      </Box>
    </>
  );
};

export default Header;
