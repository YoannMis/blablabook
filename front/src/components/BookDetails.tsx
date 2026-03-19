import { useState } from 'react';
import {
  Box,
  Collapsible,
  Flex,
  HStack,
  Icon,
  Image,
  Stack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';
import homeImage from '../assets/homePageImage.jpg';
import bookCover from '../assets/bookCover.webp';
import AppBreadcrumb from './AppBreadcrumb';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

const BookDetails = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  return (
    <PageLayout imageSrc={homeImage} imagePosition="left">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        height="100%"
        mt={{ base: '-100px', md: '40px' }}
        gap={8}
        transform={{ base: 'translateY(0)', md: 'translateX(-20%)' }}
        pb={{ base: 20, md: 2 }}
      >
        <Box>
          <Image
            src={bookCover}
            alt="Book cover"
            borderRadius="md"
            boxShadow="xl"
            width={{ base: '180px', sm: '200px', md: '340px', xl: '400px' }}
          />
        </Box>

        <Box flex="1" pt={{ base: 4, md: 0 }} alignContent={{ md: 'center' }} height="100%">
          <Stack gap={2}>
            <AppBreadcrumb
              items={[
                { label: 'Accueil', to: '/' },
                { label: 'Catégorie', to: '/books' },
                { label: 'Title' },
              ]}
            />
            <Text fontSize="3xl" fontWeight="bold">
              Titre du livre
            </Text>
            <Text fontSize="xl" color="gray.500">
              Auteur
            </Text>
            <VStack align="start" gap={4} mt={2}>
              <HStack>
                <Tag.Root variant="solid" rounded="full" px={3} py={1}>
                  <Tag.Label>Tag 1</Tag.Label>
                </Tag.Root>
                <Tag.Root variant="solid" rounded="full" px={3} py={1}>
                  <Tag.Label>Tag 2</Tag.Label>
                </Tag.Root>
              </HStack>
            </VStack>
            <Stack mt={4}>
              <Text fontWeight="bold">Description</Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ici viendra la description
                du livre... Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>

              <Collapsible.Root
                open={isDetailsOpen}
                onOpenChange={(event) => setIsDetailsOpen(event.open)}
              >
                <Collapsible.Trigger asChild>
                  <Flex align="center" justify="space-between" cursor="pointer" py={3}>
                    <Text fontWeight="bold">Détails techniques</Text>
                    <Icon>{isDetailsOpen ? <IoChevronUp /> : <IoChevronDown />}</Icon>
                  </Flex>
                </Collapsible.Trigger>

                <Collapsible.Content>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi.
                  </Text>
                </Collapsible.Content>
              </Collapsible.Root>
            </Stack>
          </Stack>
        </Box>
      </Flex>

      <MobileMenu />
    </PageLayout>
  );
};

export default BookDetails;
