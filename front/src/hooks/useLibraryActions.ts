import type { AddBookPayload } from '../types/book';
import { axiosAuth } from '../utils/axiosAuth';
import { useLibrary } from '../context/LibraryContext';

type Status = 'wishlist' | 'read';

const useLibraryActions = () => {
  const { updateBookInCollections } = useLibrary();

  const addBook = async (book: AddBookPayload) => {
    const { id, ...rest } = book;
    const res = await axiosAuth.post('/api/library', {
      book: {
        ...rest,
        googleId: id,
      },
      status: book.status ?? 'wishlist',
    });

    return res.data;
  };

  const updateBookStatus = async (
    bookId: string,
    fromKey: string,
    toKey: string,
    status: Status
  ) => {
    const res = await axiosAuth.patch(`/api/library/${bookId}`, {
      status,
    });

    updateBookInCollections(bookId, fromKey, toKey, status);

    return res.data;
  };

  const removeBook = async (bookId: string) => {
    console.log('DELETE BOOK');
    // const res = await axiosAuth.delete(`/api/library/${bookId}`);
    // return res.data;
  };

  return {
    addBook,
    updateBookStatus,
    removeBook,
  };
};

export default useLibraryActions;
