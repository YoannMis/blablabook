import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import LibraryPopoverShell from './LibraryPopoverShell';
import LibraryDrawerShell from './LibraryDrawerShell';

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
      setIsOpen(false);
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
              <LibraryDrawerShell
                title={t('book:library.addToLibrary')}
                subtitle={t('book:library.chooseCollection')}
                children={<Content />}
              />
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </>
    );
  }

  return (
    <Popover.Root open={isOpen} positioning={{ placement: 'right-start' }}>
      <Popover.Trigger asChild>{Trigger}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <LibraryPopoverShell
            title={t('book:library.addToLibrary')}
            subtitle={t('book:library.chooseCollection')}
            children={<Content />}
          />
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default AddBookActions;
