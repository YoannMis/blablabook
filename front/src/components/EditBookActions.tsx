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
  Text,
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
import { toaster } from './ui/toaster';

type Status = 'wishlist' | 'read';

interface EditBookActionsProps {
  book: Book;
  variant?: 'icon' | 'button';
  onStatusChange?: (status: Status) => void;
}

const EditBookActions = ({ book, variant = 'icon', onStatusChange }: EditBookActionsProps) => {
  const { t } = useTranslation(['book', 'common']);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { updateBookStatus, removeBook } = useLibraryActions();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      onStatusChange?.(status);
    } catch (err) {
      console.error('Failed to update book status', err);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await removeBook(book.id, book.status);

      toaster.create({
        title: t('library.deleteSuccess'),
        type: 'success',
      });

      setIsDeleteOpen(false);
    } catch (err) {
      toaster.create({
        title: t('library.deleteError'),
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
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

  const DeleteContent = (
    <VStack gap={4} p={2}>
      <HStack w="100%" gap={3}>
        <Button
          flex={1}
          minW="auto"
          justifyContent="center"
          variant="libraryAction"
          onClick={() => setIsDeleteOpen(false)}
          disabled={isDeleting}
        >
          {t('common:cancel')}
        </Button>

        <Button
          flex={1}
          minW="auto"
          color="red.400"
          justifyContent="center"
          variant="libraryAction"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {t('common:delete')}
        </Button>
      </HStack>
    </VStack>
  );

  const Trigger =
    variant === 'button' ? (
      <VStack align="start">
        <Text fontSize="sm">
          {t('book:library.alreadyInCollection', {
            collection: t(`book:library.collections.${book.status}`),
          })}
        </Text>
        <Button
          variant="plain"
          paddingLeft={0}
          color={{ _light: 'brown.800', _dark: 'light.200' }}
          bg={{ _light: 'light.100', _dark: 'brown.900' }}
          _hover={{ textDecoration: 'underline' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditOpen(true);
          }}
        >
          <HiPencil />
          {t('book:library.actions.changeCollection')}
        </Button>
      </VStack>
    ) : (
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
        onOpenChange={(e) => {
          setIsMenuOpen(e.open);
          setIsEditOpen(false);
        }}
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

                  <Button
                    variant="libraryAction"
                    color="red.400"
                    disabled={isDeleting}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsDeleteOpen(true);
                    }}
                  >
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
        <Drawer.Root open placement="bottom" onOpenChange={(e) => setIsEditOpen(e.open)}>
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

      {isDeleteOpen && isMobile && (
        <Drawer.Root open placement="bottom" onOpenChange={(e) => setIsDeleteOpen(e.open)}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <LibraryDrawerShell
                title={t('library.deleteConfirm.title')}
                subtitle={t('library.deleteConfirm.subtitle', { title: book.title })}
              >
                {DeleteContent}
              </LibraryDrawerShell>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}

      {isDeleteOpen && !isMobile && (
        <Popover.Root
          open
          onOpenChange={(e) => setIsDeleteOpen(e.open)}
          positioning={{ placement: 'right' }}
        >
          <Popover.Trigger asChild>
            <Box />
          </Popover.Trigger>

          <Portal>
            <Popover.Positioner>
              <LibraryPopoverShell
                title={t('library.deleteConfirm.title')}
                subtitle={t('library.deleteConfirm.subtitle', { title: book.title })}
              >
                {DeleteContent}
              </LibraryPopoverShell>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      )}
    </>
  );
};

export default EditBookActions;
