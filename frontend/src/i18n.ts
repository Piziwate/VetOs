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
            staff: 'Personnel',
          },
          staff: {
            title: "Staff Management",
            description: "Manage your team, roles and external partners.",
            new_member: "New Member",
            found_count: "{{count}} members found.",
            columns: {
              name: "Name",
              role: "Role",
              specialty: "Specialty",
              status: "Status",
              user_account: "User Account",
              legacy_id: "Diana ID"
            },
            roles: {
              vet: "Veterinarian",
              assistant: "Assistant",
              receptionist: "Receptionist",
              admin: "Administrator",
              external: "External Partner",
              student: "Student"
            },
            status: {
              active: "Active",
              inactive: "Inactive"
            },
            dialogs: {
              create_title: "Add team member",
              edit_title: "Edit member",
              description: "Enter the professional details of the member.",
              first_name: "First Name",
              last_name: "Last Name",
              specialty: "Specialty (optional)",
              phone: "Phone (optional)",
              role: "Professional Role",
              legacy_id: "Diana ID (for migration)",
              save: "Save member",
              cancel: "Cancel",
              delete_title: "Delete member?",
              delete_confirm: "Are you sure you want to remove this member? This action is irreversible.",
              delete_success: "Member deleted successfully.",
              create_success: "Member created successfully."
            }
          },
          clients: {
            title: "Clients",
            found_count: "{{count}} clients found in the database.",
            new_client: "New Client",
            search_placeholder: "Global search (name, phone, city...)",
            rows_per_page: "Rows per page",
            page_info: "Page {{current}} of {{total}}",
            previous: "Previous",
            next: "Next",
            loading: "Loading...",
            no_results: "No results.",
            columns: {
              legacy_id: "Diana ID",
              last_name: "Last Name",
              first_name: "First Name",
              email: "Email",
              phone: "Phone",
              city: "City",
              status: "Status",
              active: "Active",
              inactive: "Inactive"
            },
            actions: {
              title: "Actions",
              copy_id: "Copy Diana ID",
              view_profile: "View client profile",
              view_patients: "View patients"
            }
          },
          resources: {
            title: "Resource Management",
            description: "Configuration of clinics, infrastructure and planning.",
            add_site: "Add site",
            sites_group: "Sites of the group",
            tabs: {
              general: "Administration",
              infrastructure: "Infrastructure",
              planning: "Planning"
            },
            general: {
              site_info: "Site info",
              site_info_desc: "Public contact information of the clinic.",
              name: "Site name",
              email: "Email",
              phone: "Phone",
              address: "Address",
              team: "Authorized Team",
              team_desc: "Staff with access to this site.",
              manage_access: "Manage access",
              no_staff: "No staff assigned to this site.",
              delete_site: "Delete this site?",
              delete_site_desc: "All associated data will be lost."
            },
            infrastructure: {
              technical_rooms: "Technical Rooms",
              add_room: "Add room",
              no_rooms: "No room configured.",
              hospitalization: "Hospitalization",
              no_room_selected: "Select a room on the left.",
              not_hospitalization: "This room is not configured for hospitalization.",
              add_unit: "Add unit",
              no_units: "No unit in this room."
            },
            planning: {
              opening_hours: "Opening Hours",
              opening_hours_desc: "Used for reservation engine and schedules.",
              edit: "Edit",
              closed: "Closed",
              closures: "Closures & Holidays",
              closures_desc: "Exceptional closing periods of the site.",
              program: "Program",
              no_closures: "No closures programmed."
              },
              dialogs: {
              staff: {
                title: "Access Management",
                description: "Authorize team members to work on this site.",
                finish: "Finish"
              },
              room: {
                title: "Add a room",
                description: "Define the usage of this room.",
                name: "Room Name",
                vocation: "Vocation",
                cancel: "Cancel",
                create: "Create room"
              },
              unit: {
                title: "New box/cage",
                description: "Individual hosting unit for hospitalization.",
                reference: "Visual Reference",
                format: "Unit Format",
                cancel: "Cancel",
                add: "Add unit"
              },
              hours: {
                title: "Hours",
                description: "Manage opening slots for this site.",
                open: "Opening",
                close: "Closing",
                add_slot: "Add a slot",
                no_slots: "Closed all day.",
                cancel: "Cancel",
                save: "Validate hours"
              },
              closure: {
                title: "Exceptional Closure",
                description: "Program a period of holidays or works.",
                reason: "Closure Reason",
                start_date: "Start Date",
                end_date: "End Date",
                choose: "Choose...",
                cancel: "Cancel",
                save: "Save"
              },
              confirm: {
                cancel: "Cancel",
                confirm: "Confirm"
              }
              },
              room_types: {

              consultation: "Consultation",
              surgery: "Surgery",
              pre_op: "Pre-operative",
              imaging: "Imaging",
              hospitalization: "Hospitalization"
            },
            days: {
              monday: "Monday",
              tuesday: "Tuesday",
              wednesday: "Wednesday",
              thursday: "Thursday",
              friday: "Friday",
              saturday: "Saturday",
              sunday: "Sunday"
            }
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
            staff: 'Personnel',
          },
          staff: {
            title: "Gestion du Personnel",
            description: "Gérez votre équipe, les rôles et les intervenants externes.",
            new_member: "Nouveau Membre",
            found_count: "{{count}} membres trouvés.",
            columns: {
              name: "Nom",
              role: "Rôle",
              specialty: "Spécialité",
              status: "Statut",
              user_account: "Compte Utilisateur",
              legacy_id: "ID Diana"
            },
            roles: {
              vet: "Vétérinaire",
              assistant: "Assistant(e)",
              receptionist: "Réceptionniste",
              admin: "Administrateur",
              external: "Intervenant Externe",
              student: "Stagiaire / Étudiant"
            },
            status: {
              active: "Actif",
              inactive: "Inactif"
            },
            dialogs: {
              create_title: "Ajouter un membre",
              edit_title: "Modifier le membre",
              description: "Saisissez les informations professionnelles du membre de l'équipe.",
              first_name: "Prénom",
              last_name: "Nom",
              specialty: "Spécialité (optionnel)",
              phone: "Téléphone (optionnel)",
              role: "Rôle professionnel",
              legacy_id: "ID Diana (pour migration)",
              save: "Enregistrer le membre",
              cancel: "Annuler",
              delete_title: "Supprimer le membre ?",
              delete_confirm: "Êtes-vous sûr de vouloir retirer ce membre ? Cette action est irréversible.",
              delete_success: "Membre supprimé avec succès.",
              create_success: "Membre créé avec succès."
            }
          },
          clients: {
            title: "Clients",
            found_count: "{{count}} clients trouvés dans la base de données.",
            new_client: "Nouveau Client",
            search_placeholder: "Recherche globale (nom, tel, ville...)",
            rows_per_page: "Lignes par page",
            page_info: "Page {{current}} sur {{total}}",
            previous: "Précédent",
            next: "Suivant",
            loading: "Chargement en cours...",
            no_results: "Aucun résultat.",
            columns: {
              legacy_id: "ID Diana",
              last_name: "Nom",
              first_name: "Prénom",
              email: "Email",
              phone: "Téléphone",
              city: "Ville",
              status: "Statut",
              active: "Actif",
              inactive: "Inactif"
            },
            actions: {
              title: "Actions",
              copy_id: "Copier l'ID Diana",
              view_profile: "Voir la fiche client",
              view_patients: "Voir les patients"
              }
              },
              client_detail: {
              back: "Retour à la liste",
              active: "Client Actif",
              inactive: "Client Inactif",
              legacy_id: "ID Diana",
              tabs: {
              details: "Détails",
              patients: "Patients",
              appointments: "Rendez-vous",
              billing: "Facturation"
              },
              contact_info: "Coordonnées",
              email: "Email",
              phone: "Téléphone",
              address: "Adresse",
              city: "Ville",
              no_patients: "Aucun patient trouvé pour ce client.",
              add_patient: "Ajouter un Patient"
              },
              settings: {
                title: "Paramètres",
                description: "Gérez la configuration de votre cabinet et les paramètres techniques.",
                save_changes: "Enregistrer les modifications",
                saving: "Enregistrement...",
                save_success: "Paramètres enregistrés avec succès !",
                save_error: "Erreur lors de l'enregistrement.",
                operational: "Opérationnel",
                technical: "Technique",
                general: "Général",
                no_settings: "Aucun paramètre trouvé dans cette catégorie."
              },
              resources: {

            title: "Gestion des Ressources",
            description: "Configuration des cliniques, infrastructures et planning.",
            add_site: "Ajouter un site",
            sites_group: "Sites du groupe",
            tabs: {
              general: "Administration",
              infrastructure: "Infrastructure",
              planning: "Planning"
            },
            general: {
              site_info: "Coordonnées du site",
              site_info_desc: "Informations de contact public du cabinet.",
              name: "Nom du site",
              email: "Email",
              phone: "Téléphone",
              address: "Adresse",
              team: "Équipe autorisée",
              team_desc: "Personnel ayant accès à ce site.",
              manage_access: "Gérer l'accès",
              no_staff: "Aucun membre assigné à ce site.",
              delete_site: "Supprimer ce site ?",
              delete_site_desc: "Toutes les données associées seront perdues."
            },
            infrastructure: {
              technical_rooms: "Locaux techniques",
              add_room: "Ajouter un local",
              no_rooms: "Aucun local configuré.",
              hospitalization: "Hospitalisation",
              no_room_selected: "Sélectionnez un local à gauche.",
              not_hospitalization: "Ce local n'est pas configuré pour accueillir des hospitalisations.",
              add_unit: "Ajouter l'unité",
              no_units: "Aucun box ou cage dans ce local."
            },
            planning: {
              opening_hours: "Horaires d'ouverture",
              opening_hours_desc: "Utilisés pour le moteur de réservation et les agendas.",
              edit: "Éditer",
              closed: "Fermé",
              closures: "Congés & Fermetures",
              closures_desc: "Périodes exceptionnelles de fermeture du site.",
              program: "Programmer",
              no_closures: "Aucune fermeture programmée."
              },
              dialogs: {
              staff: {
                title: "Gestion des accès",
                description: "Autorisez des membres de l'équipe à travailler sur ce site.",
                finish: "Terminer"
              },
              room: {
                title: "Ajouter un local",
                description: "Définissez l'usage de cette salle.",
                name: "Nom de la salle",
                vocation: "Vocation",
                cancel: "Annuler",
                create: "Créer la salle"
              },
              unit: {
                title: "Nouveau box/cage",
                description: "Unité d'accueil individuelle pour l'hospitalisation.",
                reference: "Référence visuelle",
                format: "Format d'unité",
                cancel: "Annuler",
                add: "Ajouter l'unité"
              },
              hours: {
                title: "Horaires",
                description: "Gérez les plages d'ouverture pour ce site.",
                open: "Ouverture",
                close: "Fermeture",
                add_slot: "Ajouter une tranche",
                no_slots: "Fermé toute la journée.",
                cancel: "Annuler",
                save: "Valider les horaires"
              },
              closure: {
                title: "Fermeture exceptionnelle",
                description: "Programmez une période de congés ou travaux.",
                reason: "Motif du congé",
                start_date: "Date de début",
                end_date: "Date de fin",
                choose: "Choisir...",
                cancel: "Annuler",
                save: "Enregistrer"
              },
              confirm: {
                cancel: "Annuler",
                confirm: "Confirmer"
              }
              },
              room_types: {

              consultation: "Consultation",
              surgery: "Chirurgie",
              pre_op: "Pré-opératoire",
              imaging: "Imagerie",
              hospitalization: "Hospitalisation"
            },
            days: {
              monday: "Lundi",
              tuesday: "Mardi",
              wednesday: "Mercredi",
              thursday: "Jeudi",
              friday: "Vendredi",
              saturday: "Samedi",
              sunday: "Dimanche"
            }
          }
        }
      }
    }
  });

export default i18n;