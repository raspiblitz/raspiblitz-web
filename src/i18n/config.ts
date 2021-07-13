import i18n from 'i18next';
import en from './langs/en.json';
import de from './langs/de.json';
import { initReactI18next } from 'react-i18next';
import 'react-i18next';

export const resources = {
  en,
  de
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources
});

export default i18n;
