// fonction de conversion d'une unite de temps en millisecondes
export function convertInMs(time: string) {
  const regex = /^(\d+)([smhd])$/;
  const match = time.match(regex);
  if (!match) throw new Error('Bad Format of time.');
  const valeur = parseInt(match[1], 10);
  const unite = match[2];
  switch (unite) {
    case 's':
      return valeur * 1000;
    case 'm':
      return valeur * 1000 * 60;
    case 'h':
      return valeur * 1000 * 60 * 60;
    case 'd':
      return valeur * 1000 * 60 * 60 * 24;
    default:
      throw new Error('Unite not supported.');
  }
}
