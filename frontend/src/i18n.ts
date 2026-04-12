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
          menu: {
            group_main: 'Main',
            group_admin: 'Administration',
            dashboard: 'Dashboard',
            clients: 'Clients',
            patients: 'Patients',
            consultations: 'Consultations',
            billing: 'Billing',
            settings: 'Settings',
            profile: 'Profile',
            account: 'Account',
            logout: 'Logout',
          },
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
            title: 'Dashboard',
            subtitle: 'Welcome to your practice overview.',
            clients_title: 'VetOS Clients',
            clients_caption: 'A list of registered veterinary clients.',
            no_clients: 'No clients found.',
            add_client: 'Add New Client',
            stats: {
              total_clients: 'Total Clients',
              patients: 'Patients',
              revenue: 'Monthly Revenue',
              visits: 'Visits Today',
              activity: 'Recent Activity',
              quick_actions: 'Quick Actions',
              register_patient: 'Register New Patient',
            }
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
          menu: {
            group_main: 'Principal',
            group_admin: 'Administration',
            dashboard: 'Tableau de bord',
            clients: 'Clients',
            patients: 'Patients',
            consultations: 'Consultations',
            billing: 'Facturation',
            settings: 'Paramètres',
            profile: 'Profil',
            account: 'Compte',
            logout: 'Déconnexion',
          },
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
            title: 'Tableau de bord',
            subtitle: 'Bienvenue dans la gestion de votre cabinet.',
            clients_title: 'Clients VetOS',
            clients_caption: 'Liste des clients enregistrés.',
            no_clients: 'Aucun client trouvé.',
            add_client: 'Ajouter un client',
            stats: {
              total_clients: 'Total Clients',
              patients: 'Patients',
              revenue: 'Revenu Mensuel',
              visits: 'Visites du jour',
              activity: 'Activité Récente',
              quick_actions: 'Actions Rapides',
              register_patient: 'Enregistrer un Patient',
            }
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
          menu: {
            group_main: 'Hauptmenü',
            group_admin: 'Verwaltung',
            dashboard: 'Dashboard',
            clients: 'Kunden',
            patients: 'Patienten',
            consultations: 'Konsultationen',
            billing: 'Abrechnung',
            settings: 'Einstellungen',
            profile: 'Profil',
            account: 'Konto',
            logout: 'Abmelden',
          },
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
            title: 'Dashboard',
            subtitle: 'Willkommen in Ihrer Praxisübersicht.',
            clients_title: 'VetOS Kunden',
            clients_caption: 'Liste der registrierten Kunden.',
            no_clients: 'Keine Kunden gefunden.',
            add_client: 'Neuer Kunde',
            stats: {
              total_clients: 'Gesamtkunden',
              patients: 'Patienten',
              revenue: 'Monatlicher Umsatz',
              visits: 'Heutige Besuche',
              activity: 'Aktuelle Aktivitäten',
              quick_actions: 'Schnellaktionen',
              register_patient: 'Neuer Patient',
            }
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
