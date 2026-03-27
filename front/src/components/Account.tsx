import { useCurrentUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import ChangeLanguages from './ChangeLanguages';

const AccountPage = () => {
  const { user } = useCurrentUser();

  const { t } = useTranslation();

  return (
    <Box>
      <ChangeLanguages />
    </Box>
  );
};

export default AccountPage;
