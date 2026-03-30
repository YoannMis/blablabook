import type { AddBookPayload } from '../types/book';
import { axiosAuth } from '../utils/axiosAuth';

const useLibraryActions = () => {
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

  return { addBook };
};

export default useLibraryActions;
