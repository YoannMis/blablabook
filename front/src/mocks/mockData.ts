import bookCover from '../assets/bookCover.webp';

export const genresMock = [
  { id: 1, name: 'Fantasy' },
  { id: 2, name: 'Thriller' },
  { id: 3, name: 'Science-fiction' },
  { id: 4, name: 'Romance' },
  { id: 5, name: 'Mystery' },
  { id: 6, name: 'Horror' },
  { id: 7, name: 'Historical' },
  { id: 8, name: 'Biography' },
];

export const booksMock = [
  {
    id: '1',
    volumeInfo: {
      title: 'The Hobbit',
      averageRating: 4.8,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '2',
    volumeInfo: {
      title: 'Dune',
      averageRating: 4.6,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '3',
    volumeInfo: {
      title: 'The Name of the Wind',
      averageRating: 4.7,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '4',
    volumeInfo: {
      title: 'Gone Girl',
      averageRating: 4.1,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '5',
    volumeInfo: {
      title: '1984',
      averageRating: 4.4,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '6',
    volumeInfo: {
      title: 'The Shining',
      averageRating: 4.3,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '7',
    volumeInfo: {
      title: 'Pride and Prejudice',
      averageRating: 4.5,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
  {
    id: '8',
    volumeInfo: {
      title: 'The Martian',
      averageRating: 4.6,
      imageLinks: {
        thumbnail: bookCover,
      },
    },
  },
];
