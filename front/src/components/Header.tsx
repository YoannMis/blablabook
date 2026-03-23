import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { LiaCompass } from 'react-icons/lia';
import { Show, Box, Flex, HStack, Text } from '@chakra-ui/react';
import { IoTelescopeSharp } from 'react-icons/io5';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { t } = useTranslation('common');

  const { pathname } = useLocation();
  console.log(pathname);

  return (
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
          <NavLink to="/login" icon={BsPersonCircle}>
            <Text whiteSpace="nowrap">{t('nav.login')}</Text>
          </NavLink>
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Header;
