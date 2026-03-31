import { prisma, type ReadingStatus, type UserBook } from '../utils/prisma.utils';
import type { UserBookWithDetails, UserBookPk } from '../types/userBook.types';
import { BookSchema } from '../schema/library.schema';
import { cleanImageLinks } from '../utils/cleanImageLinks.utils';

/**
 * Formats an array of user books by extracting and transforming book details.
 * Extracts author names, publisher name, category names, and normalizes image links.
 *
 * @param userBooks - Array of user books with detailed book information
 * @returns Array of formatted user books with simplified book data structure
 */
export const formatBooks = (userBooks: UserBookWithDetails[]) => {
  return userBooks.map((userBook) => {
    const bookData = userBook.book;

    // Normalize image links structure, handling potential undefined or non-object values
    let imageLinks = null;
    if (bookData.imageLinks && typeof bookData.imageLinks === 'object') {
      imageLinks = {
        thumbnail: (bookData.imageLinks as any).thumbnail || '',
        small: (bookData.imageLinks as any).small,
        medium: (bookData.imageLinks as any).medium,
        large: (bookData.imageLinks as any).large,
      };
    }

    return {
      ...userBook,
      book: {
        ...bookData,
        status: userBook.status,
        imageLinks,
        // Extract author names from the nested author relationship
        authors: bookData.authors?.map((author) => author.author.name) || [],
        // Extract publisher name from the nested publisher relationship
        publisher: bookData.publisher?.name || null,
        // Extract category names from the nested category relationship
        categories: bookData.categories?.map((category) => category.category.name) || [],
      },
    };
  });
};

/**
 * Retrieves a paginated list of all books associated with a specific user.
 * Includes detailed book information with authors, publisher, and categories.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param offset - Pagination offset (number of items to skip)
 * @param limit - Maximum number of books to return
 * @returns Promise resolving to array of user books with detailed book information
 */
const getUserBooks = async (userId: number, offset: number, limit: number) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: { name: true },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

/**
 * Retrieves a paginated list of books associated with a specific user, filtered by reading status.
 * Includes detailed book information with authors, publisher, and categories.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param status - Reading status to filter by ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param offset - Pagination offset (number of items to skip)
 * @param limit - Maximum number of books to return
 * @returns Promise resolving to array of user books with detailed book information
 */
const getUserBooksByStatus = async (
  userId: number,
  status: string | 'all' | undefined,
  offset: number,
  limit: number
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
      status: status as ReadingStatus,
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: { name: true },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

/**
 * Counts the number of books in a user's library filtered by reading status.
 * Used for pagination total count when filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @param status - Reading status to filter by
 * @returns Promise resolving to the count of matching books
 */
const countUserBooksByStatus = async (userId: number, status: string | 'all' | undefined) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      status: status as ReadingStatus,
    },
  });
};

/**
 * Counts the total number of books in a user's library.
 * Used for pagination total count when not filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @returns Promise resolving to the total count of books
 */
const countUserBooks = async (userId: number) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
    },
  });
};

/**
 * Searches for user books with optional query filtering and pagination.
 * Searches across book title, description, author names, publisher name, and categories.
 *
 * @param userId - ID of the user whose books to search
 * @param query - Optional search term (case-insensitive)
 * @param offset - Pagination offset
 * @param limit - Maximum number of results to return
 * @returns Promise resolving to array of user books with detailed book information
 */
const searchInUserBooks = async (
  userId: number,
  query: string | undefined,
  offset: number,
  limit: number
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
      book: {
        OR: [
          // Search in author names
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

/**
 * Searches for user books filtered by reading status with optional query filtering and pagination.
 * Similar to searchUserBooks but adds status filtering.
 *
 * @param userId - ID of the user whose books to search
 * @param query - Optional search term (case-insensitive)
 * @param status - Reading status to filter by ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param offset - Pagination offset
 * @param limit - Maximum number of results to return
 * @returns Promise resolving to array of user books with detailed book information
 */
const searchInUserBooksByStatus = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined,
  offset: number,
  limit: number
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
      status: status as ReadingStatus,
      book: {
        OR: [
          // Search in author names
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

/**
 * Counts the number of user books matching search criteria filtered by reading status.
 * Used for pagination total count when filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @param query - Optional search term (case-insensitive)
 * @param status - Reading status to filter by
 * @returns Promise resolving to the count of matching books
 */
const countSearchingInLibraryResultsByStatus = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined
) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      status: status as ReadingStatus,
      book: {
        OR: [
          // Search in author names
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
  });
};

/**
 * Counts the number of all user books matching search criteria (without status filtering).
 * Used for pagination total count when not filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @param query - Optional search term (case-insensitive)
 * @returns Promise resolving to the count of matching books
 */
const countAllSearchingInLibraryResults = async (userId: number, query: string | undefined) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      book: {
        OR: [
          // Search in author names
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
  });
};

/**
 * Main function to retrieve user books with optional filtering, search, and pagination.
 * Orchestrates the search and counting operations based on whether status filtering is applied.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param query - Optional search term (case-insensitive)
 * @param status - Optional reading status filter ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param limit - Maximum number of results per page
 * @param offset - Pagination offset
 * @returns Promise resolving to object containing userBooks array and total count
 */
export const getUserBooksByQuery = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined,
  limit: number,
  offset: number
) => {
  let userBooks;
  let total; // the total count of books

  // Query the database for books associated with the user with pagination
  if (status && status !== 'all') {
    // When filtering by specific status, use status-specific search and count functions
    userBooks = await searchInUserBooksByStatus(userId, query, status, offset, limit);
    total = await countSearchingInLibraryResultsByStatus(userId, query, status);
  } else {
    // When no status filter or 'all' status, use general search and count functions
    userBooks = await searchInUserBooks(userId, query, offset, limit);
    total = await countAllSearchingInLibraryResults(userId, query);
  }

  return { userBooks, total };
};

/**
 * Main function to retrieve user books with optional status filtering and pagination.
 * Orchestrates the retrieval and counting operations based on whether status filtering is applied.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param status - Optional reading status filter ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param limit - Maximum number of results per page
 * @param offset - Pagination offset
 * @returns Promise resolving to object containing userBooks array and total count
 */
export const getUserLibraryBooks = async (
  userId: number,
  status: string | 'all' | undefined,
  limit: number,
  offset: number
) => {
  let userBooks;
  let total; // the total count of books

  // Query the database for books associated with the user with pagination
  if (status && status !== 'all') {
    // When filtering by specific status, use status-specific search and count functions
    userBooks = await getUserBooksByStatus(userId, status, offset, limit);
    total = await countUserBooksByStatus(userId, status);
  } else {
    // When no status filter or 'all' status, use general search and count functions
    userBooks = await getUserBooks(userId, offset, limit);
    total = await countUserBooks(userId);
  }

  return { userBooks, total };
};

/**
 * Finds a specific book in a user's library.
 * This function checks if a book exists in the user's library based on userId and bookId.
 *
 * @param userIdBookId - An object containing userId and bookId to identify the book in the library.
 * @returns Promise resolving to the user book record if found, or null if not found.
 */
export const findBookInLibrary = async (userIdBookId: UserBookPk) =>
  await prisma.userBook.findUnique({ where: { userId_bookId: userIdBookId } });

/**
 * Checks if a book exists in the database by its Google Book ID.
 * This function is used to determine if a book needs to be created or already exists.
 *
 * @param gooleBookId - The Google Book ID to search for.
 * @returns Promise resolving to the book record if found, or null if not found.
 */
export const checkIsExistsBook = async (gooleBookId: string) =>
  await prisma.book.findUnique({ where: { googleBookId: gooleBookId } });

/**
 * Adds a book to a user's library.
 * This function creates a new entry in the user's library with the specified book and status.
 *
 * @param data - An object containing userId, bookId, and status to add to the library.
 * @returns Promise resolving to the created user book record.
 */
export const addBookToLibrary = async (data: UserBook) => await prisma.userBook.create({ data });

/**
 * Creates authors in the database if they don't already exist.
 * This function ensures that authors are created with unique names and avoids duplicates.
 *
 * @param authors - An array of author names to create.
 * @returns Promise resolving to the created author records.
 */
const createAuthors = async (authors: string[]) =>
  prisma.author.createManyAndReturn({
    data: authors.map((author) => ({
      name: author,
    })),
    skipDuplicates: true,
  });

/**
 * Creates categories in the database if they don't already exist.
 * This function ensures that categories are created with unique names and avoids duplicates.
 *
 * @param categories - An array of category names to create.
 * @returns Promise resolving to the created category records.
 */
const createCategories = async (categories: string[]) =>
  await prisma.category.createManyAndReturn({
    data: categories.map((category) => ({
      name: category,
    })),
    skipDuplicates: true,
  });

/**
 * Creates a new book in the database and adds it to the user's library.
 * This function handles the creation of the book, its associated authors, categories, and publisher.
 * It also adds the book to the user's library with the specified reading status.
 *
 * @param userId - The ID of the user to whom the book will be added.
 * @param status - The reading status of the book in the user's library.
 * @param googleBookData - The book data from Google Books API.
 * @returns Promise that resolves when the book is created and added to the user's library.
 */
export const createBook = async (
  userId: number,
  status: ReadingStatus,
  googleBookData: BookSchema
) => {
  const authors = await createAuthors(googleBookData.authors);
  const categories = await createCategories(googleBookData.categories);

  const createdBook = await prisma.book.create({
    include: {
      publisher: true,
      authors: true,
      categories: true,
    },
    data: {
      title: googleBookData.title,
      averageRating: googleBookData.averageRating,
      ratingCount: googleBookData.ratingCount,
      imageLinks: cleanImageLinks(googleBookData.imageLinks),
      language: googleBookData.language,
      description: googleBookData.description,
      googleBookId: googleBookData.googleId,
      publishedDate: googleBookData.publishedDate,
      isbn10: googleBookData.isbn10,
      isbn13: googleBookData.isbn13,
      pageCount: googleBookData.pageCount,
      publisher: {
        connectOrCreate: {
          create: {
            name: googleBookData.publisher,
          },
          where: {
            name: googleBookData.publisher,
          },
        },
      },
    },
  });

  await prisma.bookAuthor.createMany({
    data: authors.map((author) => ({
      bookId: createdBook.id,
      authorId: author.id,
    })),
  });

  await prisma.bookCategory.createMany({
    data: categories.map((category) => ({
      bookId: createdBook.id,
      categoryId: category.id,
    })),
  });

  await addBookToLibrary({ userId, bookId: createdBook.id, status });
};

/**
 * Updates the reading status of a book in the user's library.
 * This function updates the status of a specific book identified by userId and bookId.
 *
 * @param userIdBookId - An object containing userId and bookId to identify the book in the library.
 * @param status - The new reading status to set ('read', 'wishlist').
 * @returns Promise resolving to the updated user book record.
 */
export const updateUserBook = async (
  userIdBookId: UserBookPk,
  status: ReadingStatus | undefined
): Promise<UserBook> => {
  return await prisma.userBook.update({
    where: {
      userId_bookId: userIdBookId,
    },
    data: {
      status,
    },
  });
};

/**
 * Deletes a book in the user's library.
 * This function deletes a specific book identified by userId and bookId.
 *
 * @param userIdBookId - An object containing userId and bookId to identify the book in the library.
 * @returns Promise resolving to the deleted user book record.
 */
export const deleteUserBook = async (userIdBookId: UserBookPk): Promise<void> => {
  await prisma.userBook.delete({
    where: {
      userId_bookId: userIdBookId,
    },
  });
};
