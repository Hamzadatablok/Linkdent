import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// القاموس المركزي للغات المنصة
const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      appointments: "Appointments",
      patients: "Patients Management",
      settings: "Settings",
      totalRevenue: "Total Revenue",
      registeredPatients: "Registered Patients",
      credits: "Credits",
      recentPatients: "Recent Patients",
      viewAll: "View All"
    }
  },
  ar: {
    translation: {
      dashboard: "الرئيسية",
      appointments: "حجز المواعيد",
      patients: "إدارة المرضى",
      settings: "إعدادات العيادة",
      totalRevenue: "إجمالي المداخيل",
      registeredPatients: "المرضى المسجلين",
      credits: "الديون المتبقية",
      recentPatients: "أحدث المرضى المسجلين",
      viewAll: "عرض الكل"
    }
  },
  fr: {
    translation: {
      dashboard: "Tableau de Bord",
      appointments: "Rendez-vous",
      patients: "Gestion des Patients",
      settings: "Paramètres",
      totalRevenue: "Revenu Total",
      registeredPatients: "Patients Inscrits",
      credits: "Crédits",
      recentPatients: "Patients Récents",
      viewAll: "Voir Tout"
    }
  },
  es: {
    translation: {
      dashboard: "Panel de Control",
      appointments: "Citas",
      patients: "Gestión de Pacientes",
      settings: "Configuraciones",
      totalRevenue: "Ingresos Totales",
      registeredPatients: "Pacientes Registrados",
      credits: "Créditos",
      recentPatients: "Pacientes Recientes",
      viewAll: "Ver Todo"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // اللغة الرئيسية الافتراضية
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // لا حاجة لها مع React
    }
  });

export default i18n;