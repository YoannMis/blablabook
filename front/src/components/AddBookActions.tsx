import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Popover,
  Portal,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';

import type { Book } from '../types/book';
import useLibraryActions from '../hooks/useLibraryActions';
import { toaster } from './ui/toaster';

interface Props {
  book: Book;
}

const getErrorKey = (errorCode?: string) => {
  switch (errorCode) {
    case 'BOOK_ALREADY_IN_LIBRARY':
      return 'book:library.errors.bookAlreadyInLibrary';

    case 'INTERNAL_SERVER_ERROR':
    default:
      return 'book:library.errors.internalServerError';
  }
};

const AddBookActions = ({ book }: Props) => {
  const { t } = useTranslation(['common', 'book']);
  const { addBook } = useLibraryActions();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const addBookOptions = [
    { type: 'wishlist', label: t('book:library.collections.wishlist') },
    { type: 'read', label: t('book:library.collections.read') },
  ] as const;

  const handleAddBook = async (status: 'wishlist' | 'read') => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await addBook({ ...book, status });

      if (res?.success) {
        toaster.create({
          title: t('book:library.addSuccess', {
            title: book.title,
            status: t(`book:library.collections.${status}`),
          }),
          type: 'success',
        });
      }

      setIsOpen(false);
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;
      toaster.create({
        title: t(getErrorKey(errorCode)),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Content = () => (
    <VStack gap={4}>
      {addBookOptions.map((option) => (
        <Button
          key={option.type}
          w="100%"
          py={6}
          px={5}
          borderRadius="xl"
          justifyContent="flex-start"
          fontWeight="semibold"
          fontSize="md"
          bg={{ _light: 'light.200', _dark: 'gray.800' }}
          color={{ _light: 'brown.800', _dark: 'light.200' }}
          onClick={() => handleAddBook(option.type)}
          disabled={isSubmitting}
        >
          {option.label}
        </Button>
      ))}
    </VStack>
  );

  const Trigger = (
    <IconButton
      aria-label={t('bookCard.addBook')}
      size="xs"
      position="absolute"
      top={2}
      right={2}
      variant="glass"
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
      }}
    >
      <TiPlus />
    </IconButton>
  );

  if (isMobile) {
    return (
      <>
        {Trigger}
        <Drawer.Root placement="bottom" open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content
                py={4}
                bg={{ _light: 'light.100', _dark: 'rgba(26,22,18,0.92)' }}
                backdropFilter="blur(12px)"
                borderTopRadius="2xl"
                borderWidth="1px"
                borderColor={{ _light: 'light.300', _dark: 'rgba(255,255,255,0.06)' }}
              >
                <Box
                  w="40px"
                  h="4px"
                  borderRadius="full"
                  mx="auto"
                  mb={2}
                  bg={{ _light: 'light.400', _dark: 'rgba(255,255,255,0.10)' }}
                />
                <Drawer.Header
                  letterSpacing="tight"
                  fontFamily="heading"
                  fontSize="lg"
                  fontWeight="semibold"
                  pb={1}
                >
                  {t('book:library.addToLibrary')}
                </Drawer.Header>
                <Drawer.Description
                  px={6}
                  pb={3}
                  fontSize="sm"
                  color={{ _light: 'brown.700', _dark: 'light.400' }}
                >
                  {t('book:library.chooseCollection')}
                </Drawer.Description>
                <Drawer.Body>
                  <Content />
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </>
    );
  }

  return (
    <Popover.Root positioning={{ placement: 'right-start' }}>
      <Popover.Trigger asChild>{Trigger}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            bg={{ _light: 'light.50', _dark: 'gray.900' }}
            borderWidth="1px"
            borderColor={{ _light: 'light.300', _dark: 'rgba(255,255,255,0.10)' }}
            borderRadius="2xl"
            boxShadow={{
              _light: '0 16px 40px rgba(0,0,0,0.12)',
              _dark: '0 16px 40px rgba(0,0,0,1)',
            }}
          >
            <Box px={4} pt={4} pb={3}>
              <Box
                fontWeight="semibold"
                fontSize="md"
                fontFamily="heading"
                color={{ _dark: 'light.100' }}
              >
                {t('book:library.addToLibrary')}
              </Box>

              <Box fontSize="sm" mt={1} color={{ _light: 'brown.600', _dark: 'light.500' }}>
                {t('book:library.chooseCollection')}
              </Box>
            </Box>
            <Box px={4} pb={4}>
              <Content />
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default AddBookActions;
