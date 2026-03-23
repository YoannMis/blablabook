import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Stack, HStack, Text, Link as ChakraLink, Tabs } from '@chakra-ui/react';
import { Link } from 'react-router';
import { GiBookshelf } from 'react-icons/gi';
import { BsCollectionFill } from 'react-icons/bs';
import axios from 'axios';

import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import CollectionList from './CollectionList';

import homeImage from '../assets/homePageImage.jpg';
import { booksMock } from '../mocks/mockData';

const LibraryPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [myBooks, setMyBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/library`);
        setMyBooks(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyBooks();
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
      <PageLayout imageSrc={homeImage}>
        <Stack gap={6} pb={{ base: 20, md: 2 }}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
          <Tabs.Root defaultValue="all-books" navigate={({ value }) => navigate(`/${value}`)}>
            <Tabs.List>
              <Tabs.Trigger value="all-books" asChild>
                <ChakraLink unstyled>
                  <GiBookshelf />
                  <Link to={'/library'}>Tous les livres</Link>
                </ChakraLink>
              </Tabs.Trigger>
              <Tabs.Trigger value="collections" asChild>
                <ChakraLink unstyled>
                  <BsCollectionFill />
                  <Link to={'/library/collections'}>Collections</Link>
                </ChakraLink>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="all-books">
              <CollectionList books={booksMock} />
            </Tabs.Content>
            <Tabs.Content value="collections">Manage your collections</Tabs.Content>
          </Tabs.Root>
        </Stack>
        <MobileMenu />
      </PageLayout>
    </>
  );
};

export default LibraryPage;
