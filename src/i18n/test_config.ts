// this is the i18n config used for testing
import i18n from "i18next";
import "react-i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: { en: { translations: {} } },
});

export default i18n;
