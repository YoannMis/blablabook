import { Flex } from '@chakra-ui/react';
import NavLink from './NavLink';
import { IoTelescopeSharp } from 'react-icons/io5';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

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
      bg="grey"
      justify="space-around"
      p={4}
    >
      <NavLink to="/" icon={<IoTelescopeSharp />} vertical>
        {t('nav.discover')}
      </NavLink>
      <NavLink to="/library" icon={<TbBookFilled />} vertical>
        {t('nav.library')}
      </NavLink>
      <NavLink to="/login" icon={<BsPersonCircle />} vertical>
        {t('nav.login')}
      </NavLink>
    </Flex>
  );
};

export default MobileMenu;
