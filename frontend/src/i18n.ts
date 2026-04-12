import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          app_name: 'VetOS',
          menu: {
            dashboard: 'Dashboard',
            clients: 'Clients',
            patients: 'Patients',
            billing: 'Billing',
            settings: 'Settings',
            logout: 'Logout',
            consultations: 'Consultations',
            stats: 'Statistics',
            theme: 'Theme',
            language: 'Language',
          }
        }
      },
      fr: {
        translation: {
          app_name: 'VetOS',
          menu: {
            dashboard: 'Tableau de bord',
            clients: 'Clients',
            patients: 'Patients',
            billing: 'Facturation',
            settings: 'Paramètres',
            logout: 'Déconnexion',
            consultations: 'Consultations',
            stats: 'Statistiques',
            theme: 'Thème',
            language: 'Langue',
          }
        }
      }
    }
  });

export default i18n;