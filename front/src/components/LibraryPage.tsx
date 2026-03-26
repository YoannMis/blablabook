import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Box } from '@chakra-ui/react';
import { Stack, Tabs, HStack, Heading } from '@chakra-ui/react';
import { GiBookshelf } from 'react-icons/gi';
import { BsCollectionFill } from 'react-icons/bs';
// import axios from 'axios';

import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';

import homeImage from '../assets/homePageImage.jpg';
import { useTranslation } from 'react-i18next';

const LibraryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('book');
  const [searchValue, setSearchValue] = useState('');
  // const [userBooks, setUserBooks] = useState<Book[]>([]);

  const tabRoutes: Record<string, string> = {
    'all-books': '/library',
    collections: '/library/collections',
  };

  const tabsData = [
    { value: 'all-books', icon: GiBookshelf, label: t('library.allBooks') },
    { value: 'collections', icon: BsCollectionFill, label: t('library.collections') },
  ];

  useEffect(() => {
    // const fetchUserBooks = async () => {
    //   try {
    //     const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/library`);
    //     setUserBooks(res.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // fetchUserBooks();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
  };

  const handleSubmit = async () => {
    // En attende de l'API Back
    // try {
    // const response = await axios.get('/api/library', {
    //   params: { query: searchValue },
    // });
    // setSearchResults(response.data);
    // } catch (error) {
    //   console.error('Erreur lors de la recherche :', error);
    // }
  };

  return (
    <>
      <PageLayout imageSrc={homeImage} imageSize={25}>
        <Stack gap={6} pb={{ base: 20, md: 2 }}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          <Tabs.Root
            defaultValue="all-books"
            variant="line"
            onValueChange={({ value }) => navigate(tabRoutes[value])}
          >
            <Tabs.List mb={4} justifyContent="space-around">
              {tabsData.map(({ value, icon: Icon, label }) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  asChild
                  flex={1}
                  _selected={{
                    color: { _light: 'gray.700', _dark: 'light.50' },
                  }}
                  color={{ _light: 'gray.500', _dark: 'light.200' }}
                >
                  <Box display="flex" justifyContent="center" alignItems="center" w="100%">
                    <HStack gap={2}>
                      <Icon />
                      <Heading size="md">{label}</Heading>
                    </HStack>
                  </Box>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Outlet />
          </Tabs.Root>
        </Stack>
        <MobileMenu />
      </PageLayout>
    </>
  );
};

export default LibraryPage;
