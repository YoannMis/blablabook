import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Stack } from '@chakra-ui/react';
import axios from 'axios';

import { PageLayout } from '../components/layouts/PageLayout';
import MobileMenu from '../components/MobileMenu';
import SearchBar from './SearchBar';
import CategoriesList from './CategoriesList';
import BookCardList from './BookCardList';

import homeImage from '../assets/homePageImage.jpg';
import { genresMock } from '../mocks/mockData';
import { slugify } from '..//utils/stringUtils';
import { getThemeLabel } from '../utils/themeUtils';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const [featuredBooks, setFeaturedBooks] = useState<Record<string, Book[]>>({});

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/topFeaturedThemes`);
        setFeaturedBooks(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeatured();
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
    // const response = await axios.get('/api/books/search', {
    //   params: { q: searchValue },
    // });
    // setSearchResults(response.data);
    // } catch (error) {
    //   console.error('Erreur lors de la recherche :', error);
    // }
  };

  const handleSelectCategory = (categoryName: string) => {
    const slug = slugify(categoryName);
    navigate(`/categories/${slug}`);
  };

  return (
    <>
      <PageLayout imageSrc={homeImage} imagePosition="top" imageSize="25%">
        <Stack gap={6} pb={{ base: 20, md: 2 }}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          <CategoriesList categories={genresMock} onSelectCategory={handleSelectCategory} />

          {Object.entries(featuredBooks).map(([themeKey, books]) => (
            <BookCardList key={themeKey} title={getThemeLabel(themeKey)} books={books} />
          ))}
        </Stack>

        <MobileMenu />
      </PageLayout>
    </>
  );
};

export default HomePage;
