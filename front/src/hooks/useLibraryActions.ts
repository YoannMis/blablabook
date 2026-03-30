import type { AddBookPayload } from '../types/book';
// import { axiosAuth } from '../utils/axiosAuth';

const useLibraryActions = () => {
  const addBook = async (book: AddBookPayload) => {
    // const { id, ...rest } = book;
    // const res = await axiosAuth.post('/library', {
    //   book: {
    //     ...rest,
    //     bookId: id
    //   },
    //   status: book.status ?? 'wishlist',
    // });
    // return res.data;

    // simulation latence réseau
    await new Promise((res) => setTimeout(res, 600));

    return {
      success: true,
    };
  };

  return { addBook };
};

export default useLibraryActions;
