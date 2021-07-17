import i18n from 'i18next';
import en from './langs/en.json';
import de from './langs/de.json';
import nb_NO from './langs/nb_NO.json';
import fr from './langs/fr.json';
import { initReactI18next } from 'react-i18next';
import 'react-i18next';

export const resources = {
  en,
  de,
  nb_NO,
  fr
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources
});

export default i18n;
