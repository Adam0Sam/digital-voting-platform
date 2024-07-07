import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Hello: 'Hello',
      //   'Explore the App': 'Explore the App',
    },
  },
  lt: {
    translation: {
      Hello: 'Sveikas',
      'Explore the App': 'Apžvelk svetainę',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  // TODO: add language change options
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
