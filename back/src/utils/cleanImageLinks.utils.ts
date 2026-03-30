export const cleanImageLinks = (imageLinks: any) => {
  if (!imageLinks) return imageLinks;

  return Object.fromEntries(
    Object.entries(imageLinks).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replaceAll('&amp;', '&') : value,
    ])
  );
};
