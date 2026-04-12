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
          tagline: 'Modern Veterinary Practice Management',
          login: {
            title: 'Login to VetOS',
            description: 'Enter your email and password to access your dashboard',
            email: 'Email',
            password: 'Password',
            submit: 'Login',
            loading: 'Logging in...',
            error: 'Failed to login',
          },
          dashboard: {
            clients_title: 'VetOS Clients',
            clients_caption: 'A list of registered veterinary clients.',
            no_clients: 'No clients found.',
            add_client: 'Add New Client',
          },
          client_form: {
            title: 'New Client',
            first_name: 'First Name',
            last_name: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            city: 'City',
            zip: 'ZIP Code',
            save: 'Save Client',
            saving: 'Saving...',
          }
        }
      },
      fr: {
        translation: {
          app_name: 'VetOS',
          tagline: 'Gestion Moderne pour Cabinet Vétérinaire',
          login: {
            title: 'Connexion à VetOS',
            description: 'Entrez votre email et mot de passe pour accéder à votre tableau de bord',
            email: 'Email',
            password: 'Mot de passe',
            submit: 'Se connecter',
            loading: 'Connexion...',
            error: 'Échec de la connexion',
          },
          dashboard: {
            clients_title: 'Clients VetOS',
            clients_caption: 'Liste des clients enregistrés.',
            no_clients: 'Aucun client trouvé.',
            add_client: 'Ajouter un client',
          },
          client_form: {
            title: 'Nouveau Client',
            first_name: 'Prénom',
            last_name: 'Nom',
            email: 'Email',
            phone: 'Téléphone',
            address: 'Adresse',
            city: 'Ville',
            zip: 'Code Postal',
            save: 'Enregistrer le client',
            saving: 'Enregistrement...',
          }
        }
      },
      de: {
        translation: {
          app_name: 'VetOS',
          tagline: 'Moderne Tierarztpraxis-Verwaltung',
          login: {
            title: 'Login bei VetOS',
            description: 'E-Mail und Passwort eingeben',
            email: 'E-Mail',
            password: 'Passwort',
            submit: 'Anmelden',
            loading: 'Anmeldung...',
            error: 'Anmeldung fehlgeschlagen',
          },
          dashboard: {
            clients_title: 'VetOS Kunden',
            clients_caption: 'Liste der registrierten Kunden.',
            no_clients: 'Keine Kunden gefunden.',
            add_client: 'Neuer Kunde',
          },
          client_form: {
            title: 'Neuer Kunde',
            first_name: 'Vorname',
            last_name: 'Nachname',
            email: 'E-Mail',
            phone: 'Telefon',
            address: 'Adresse',
            city: 'Stadt',
            zip: 'PLZ',
            save: 'Speichern',
            saving: 'Wird gespeichert...',
          }
        }
      }
    }
  });

export default i18n;
