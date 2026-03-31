import {
  Box,
  Button,
  Drawer,
  HStack,
  IconButton,
  Popover,
  Portal,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { HiDotsHorizontal } from 'react-icons/hi';
import type { Book } from '../types/book';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LibraryPopoverShell from './LibraryPopoverShell';
import LibraryDrawerShell from './LibraryDrawerShell';
import useLibraryActions from '../hooks/useLibraryActions';
import { HiCheck } from 'react-icons/hi';
import { HiPencil, HiTrash } from 'react-icons/hi';

type Status = 'wishlist' | 'read';

interface EditBookActionsProps {
  book: Book;
}

const EditBookActions = ({ book }: EditBookActionsProps) => {
  const { t } = useTranslation('book');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { updateBookStatus } = useLibraryActions();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const options: { type: Status; label: string }[] = [
    { type: 'wishlist', label: t('book:library.collections.wishlist') },
    { type: 'read', label: t('book:library.collections.read') },
  ];

  const handleUpdateStatus = async (status: Status) => {
    try {
      await updateBookStatus(
        book.id,
        book.status, // fromKey
        status, // toKey
        status // newStatus
      );

      setIsEditOpen(false);
      setIsMenuOpen(false);
    } catch (err) {
      console.error('Failed to update book status', err);
    }
  };

  const Content = (
    <VStack gap={4}>
      {options.map((opt) => {
        const isActive = book.status === opt.type;

        return (
          <Button
            key={opt.type}
            w="100%"
            py={6}
            px={5}
            variant="libraryAction"
            color={{ _light: 'brown.800', _dark: 'light.200' }}
            borderWidth="2px"
            boxShadow={isActive ? 'sm' : 'none'}
            opacity={isActive ? 0.5 : 1}
            cursor={isActive ? 'not-allowed' : 'pointer'}
            _hover={{
              borderColor: isActive ? 'none' : 'brown.300',
              opacity: isActive ? 0.7 : 0.9,
              transform: isActive ? 'none' : 'translateY(-1px)',
            }}
            onClick={() => {
              if (!isActive) handleUpdateStatus(opt.type);
            }}
          >
            <HStack justify="space-between" w="100%">
              <span>{opt.label}</span>
              {isActive && <HiCheck />}
            </HStack>
          </Button>
        );
      })}
    </VStack>
  );
  const handleDelete = () => {
    //! Todo
    setIsMenuOpen(false);
  };

  const Trigger = (
    <IconButton
      aria-label={t('bookCard.editBook')}
      size="xs"
      variant="glass"
      onClick={(e) => {
        e.stopPropagation();
        setIsMenuOpen(true);
      }}
    >
      <HiDotsHorizontal />
    </IconButton>
  );

  return (
    <>
      <Popover.Root
        open={isMenuOpen}
        onOpenChange={(e) => setIsMenuOpen(e.open)}
        positioning={{ placement: 'right-start' }}
        size="xs"
      >
        <Popover.Trigger asChild>{Trigger}</Popover.Trigger>

        <Portal>
          <Popover.Positioner>
            <LibraryPopoverShell
              width="200px"
              children={
                <VStack gap={3} pt={4}>
                  <Button
                    variant="libraryAction"
                    color={{ _light: 'brown.800', _dark: 'light.200' }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditOpen(true);
                    }}
                  >
                    <HiPencil />
                    {t('library.actions.edit')}
                  </Button>

                  <Button variant="libraryAction" color="red.400" onClick={handleDelete}>
                    <HiTrash />
                    {t('library.actions.delete')}
                  </Button>
                </VStack>
              }
            />
          </Popover.Positioner>
        </Portal>
      </Popover.Root>

      {isEditOpen && isMobile && (
        <Drawer.Root open placement="bottom" onOpenChange={() => setIsEditOpen(false)}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <LibraryDrawerShell title={t('library.actions.editCollection')} children={Content} />
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}

      {isEditOpen && !isMobile && (
        <Popover.Root
          open
          onOpenChange={() => setIsEditOpen(false)}
          positioning={{ placement: 'right' }}
        >
          <Popover.Trigger asChild>
            <Box />
          </Popover.Trigger>

          <Portal>
            <Popover.Positioner>
              <LibraryPopoverShell title={t('library.actions.editCollection')} children={Content} />
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      )}
    </>
  );
};

export default EditBookActions;
