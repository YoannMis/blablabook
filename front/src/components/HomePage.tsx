import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import type { Book } from '../types/book';
import { Button, Stack, Separator } from '@chakra-ui/react';
import { PageLayout } from '../components/layouts/PageLayout';
import MobileMenu from '../components/MobileMenu';
import SearchBar from './SearchBar';
import CategoriesList from './CategoriesList';
import BookCardList from './BookCardList';

import homeImage from '../assets/homePageImage.jpg';
import { genresMock } from '../mocks/mockData';
import { slugify } from '../utils/stringUtils';
import { getThemeLabel } from '../utils/themeUtils';
import { useBookSearch } from '../hooks/useBookSearch';
import { useColorModeValue } from './ui/color-mode';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const separatorColor = useColorModeValue('light.300', 'brown.600');

  const isInitialRender = useRef(true);

  const {
    searchValue,
    searchResults,
    handleSearchChange,
    handleSubmit,
    handleLoadMoreBooks,
    handleClear,
    isLoading,
    isInitialLoading,
    hasMoreResults,
    activeQuery,
  } = useBookSearch();

  const [featuredBooks, setFeaturedBooks] = useState<Record<string, Book[]>>({});

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!activeQuery) {
      const fetchFeatured = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/books/topFeaturedThemes`
          );
          setFeaturedBooks(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchFeatured();
    } else {
      setFeaturedBooks({});
    }
  }, [activeQuery]);

  const handleSelectCategory = (categoryName: string) => {
    const slug = slugify(categoryName);
    navigate(`/categories/${slug}`);
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="top" imageSize={25}>
      <Stack gap={6} pb={{ base: 20, md: 2 }}>
        <SearchBar
          searchValue={searchValue}
          onChange={handleSearchChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <CategoriesList categories={genresMock} onSelectCategory={handleSelectCategory} />

        {activeQuery ? (
          <>
            <BookCardList
              title={t('search.resultsFor', { query: activeQuery })}
              books={searchResults}
              isLoading={isInitialLoading}
            />
            {hasMoreResults && (
              <Button onClick={handleLoadMoreBooks} loading={isLoading} mt={4}>
                {t('search.loadMore')}
              </Button>
            )}
          </>
        ) : (
          Object.entries(featuredBooks).map(([themeKey, books]) => (
            <>
              <BookCardList
                key={themeKey}
                title={getThemeLabel(themeKey)}
                books={books}
                wrap={false}
              />
              <Separator borderColor={separatorColor} borderWidth="1.5px" opacity={0.6} />
            </>
          ))
        )}
      </Stack>

      <MobileMenu />
    </PageLayout>
  );
};

export default HomePage;
