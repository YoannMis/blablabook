import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { PageLayout } from '../components/layouts/PageLayout';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import homeImage from '../assets/homePageImage.jpg';
import SearchBar from './SearchBar';

const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
  };

  const handleSubmit = async () => {
    // En attende de l'API Back
    // try {
    // const response = await axios.get('/api/books/search', {
    //   params: { q: searchValue },
    // });
    // setSearchResults(response.data);
    // } catch (error) {
    //   console.error('Erreur lors de la recherche :', error);
    // }
  };

  return (
    <>
      <PageLayout imageSrc={homeImage} header={<Header />} imagePosition="top" imageSize="25%">
        <Box p={4}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
        </Box>
      </PageLayout>

      <MobileMenu />
    </>
  );
};

export default HomePage;
