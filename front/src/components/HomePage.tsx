import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Stack } from '@chakra-ui/react';
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
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);

  const [featuredBooks, setFeaturedBooks] = useState<Record<string, Book[]>>({});

  const hasSearchResults = searchResults.length > 0;

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
    try {
      setIsLoading(true);
      setStartIndex(0);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/search`, {
        params: { q: searchValue },
      });
      setSearchResults(data);
      setHasMoreResults(data.length === 20);
    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreBooks = async () => {
    try {
      setIsLoading(true);

      const nextIndex = startIndex + 20;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/search`, {
        params: { q: searchValue, startIndex: nextIndex },
      });

      setSearchResults((prev) => [...prev, ...res.data]);
      setStartIndex(nextIndex);
      if (res.data.length < 20) {
        setHasMoreResults(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargemen de plus de résultats :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (categoryName: string) => {
    const slug = slugify(categoryName);
    navigate(`/categories/${slug}`);
  };

  return (
    <>
      <PageLayout imageSrc={homeImage} imagePosition="top" imageSize={25}>
        <Stack gap={6} pb={{ base: 20, md: 2 }}>
          <SearchBar
            searchValue={searchValue}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          <CategoriesList categories={genresMock} onSelectCategory={handleSelectCategory} />

          <>
            {hasSearchResults ? (
              <>
                <BookCardList
                  title={t('search.resultsFor', { query: searchValue })}
                  books={searchResults}
                />

                {hasMoreResults && (
                  <Button onClick={handleLoadMoreBooks} loading={isLoading} mt={4}>
                    {t('search.loadMore')}
                  </Button>
                )}
              </>
            ) : (
              Object.entries(featuredBooks).map(([themeKey, books]) => (
                <BookCardList
                  key={themeKey}
                  title={getThemeLabel(themeKey)}
                  books={books}
                  wrap={false}
                />
              ))
            )}
          </>
        </Stack>
        <MobileMenu />
      </PageLayout>
    </>
  );
};

export default HomePage;
