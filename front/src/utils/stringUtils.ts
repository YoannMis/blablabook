/**
 * Converts a string to a URL-friendly slug.
 * Example: "Science Fiction" -> "science-fiction"
 */
export const slugify = (string: string) =>
  string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
