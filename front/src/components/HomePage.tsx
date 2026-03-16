import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Stack } from '@chakra-ui/react';

import { PageLayout } from '../components/layouts/PageLayout';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import SearchBar from './SearchBar';
import CategoriesList from './CategoriesList';
import { genresMock } from '../../mock/mockData';
import homeImage from '../assets/homePageImage.jpg';

const HomePage = () => {
  const navigate = useNavigate();
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

  const handleSelectCategory = (categoryName: string) => {
    navigate(`/categories/${categoryName.toLowerCase()}`);
  };

  return (
    <>
      <PageLayout imageSrc={homeImage} header={<Header />} imagePosition="top" imageSize="25%">
        <Stack gap={4}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          <CategoriesList categories={genresMock} onSelectCategory={handleSelectCategory} />
        </Stack>
      </PageLayout>

      <MobileMenu />
    </>
  );
};

export default HomePage;
