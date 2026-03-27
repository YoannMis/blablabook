import { useTranslation } from 'react-i18next';
import { Button } from '@chakra-ui/react';

const ChangeLanguages = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Button
      rounded={'full'}
      onClick={() => (i18n.language === 'en' ? changeLanguage('fr') : changeLanguage('en'))}
    >
      {i18n.language === 'en' ? 'FR' : 'EN'}
    </Button>
  );
};

export default ChangeLanguages;
