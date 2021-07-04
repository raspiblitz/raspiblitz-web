import i18n from 'i18next';
import en from './en/translation.json';
import de from './de/translation.json';
import { initReactI18next } from 'react-i18next';
import 'react-i18next';

export const resources = {
  en,
  de
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  resources
});
