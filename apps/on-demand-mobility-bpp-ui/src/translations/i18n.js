import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { TRANSLATIONS_HINDI } from "./hindi/hindi";
import { TRANSLATIONS_EN } from "./en/en";

i18n.use(initReactI18next).init({
  lng: "en",
  nsSeparator: ">",
  fallbackLng: "en",
  debug: false,
  resources: {
    en: {
      translation: TRANSLATIONS_EN,
    },
    hindi: {
      translation: TRANSLATIONS_HINDI,
    },
  },
});

export default i18n;
