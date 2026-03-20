export const themeLabels: Record<string, string> = {
  dragon: 'Passion dragons 🐉',
  gardening: 'Envie de jardinage 🌱',
  ecology: 'Pour la planète 🌍',
  cooking: 'À vos fourneaux 🍳',
  travel: 'Envie de voyager ✈️',
  tech: 'Les nouvelles technologies 💻',
  animals: 'Compagnons poilus 🐾',
};

export const getThemeLabel = (themeKey: string): string => {
  return themeLabels[themeKey] ?? themeKey;
};
