import i18n from "i18next";
import "react-i18next";
import { initReactI18next } from "react-i18next";
import cs from "./langs/cs.json";
import de from "./langs/de.json";
import en from "./langs/en.json";
import es from "./langs/es.json";
import fr from "./langs/fr.json";
import hu from "./langs/hu.json";
import it from "./langs/it.json";
import nb_NO from "./langs/nb_NO.json";
import nl from "./langs/nl.json";
import pt_BR from "./langs/pt_BR.json";
import sv from "./langs/sv.json";
import vi from "./langs/vi.json";

export const resources = {
  cs,
  de,
  en,
  nb_NO,
  nl,
  fr,
  hu,
  pt_BR,
  it,
  es,
  sv,
  vi,
};

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources,
  returnNull: false,
});

export default i18n;
