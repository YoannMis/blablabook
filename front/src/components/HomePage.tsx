import { Box, Text } from '@chakra-ui/react';
import { PageLayout } from '../components/layouts/PageLayout';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import homeImage from '../assets/homePageImage.jpg';

const HomePage = () => {
  return (
    <>
      <PageLayout imageSrc={homeImage} header={<Header />} imagePosition="top" imageSize="25%">
        <Box p={4}>
          <Text fontSize="2xl">Bienvenue sur BlablaBook !</Text>
        </Box>
      </PageLayout>

      <MobileMenu />
    </>
  );
};

export default HomePage;
