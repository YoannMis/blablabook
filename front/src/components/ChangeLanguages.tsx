import { useTranslation } from 'react-i18next';
import { Button } from '@chakra-ui/react';

const ChangeLanguages = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);

    // Enregistrer la langue choisie dans le localStorage
    localStorage.setItem('userLanguage', lang);
  };

  return (
    <Button
      rounded={'full'}
      onClick={() => (i18n.language === 'en' ? changeLanguage('fr') : changeLanguage('en'))}
    >
      {i18n.language === 'en'
        ? 'Choisissez votre langue : Français'
        : 'Choose your language : English'}
    </Button>
  );
};

export default ChangeLanguages;
