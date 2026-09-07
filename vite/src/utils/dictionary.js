// القاموس الشامل لمنصة Linkdent (الأنظمة الطبية والتأمين)
export const translations = {
    en: {
        dashboardGroup: "Corporate Dashboard",
        dashboard: "Dashboard",
        appointments: "Appointments",
        patients: "Patients Management",
        settings: "Clinic Settings",
        linkdentGroup: "Linkdent",
        odontogram: "Odontogram",
        prescriptions: "Prescriptions",
        certificates: "Medical Certificates",
        expenses: "Expenses",
        mutuelleTitle: "Mutuelle & Assurances",
        selectPatient: "Select Patient from Records",
        editData: "Edit Data",
        printForm: "Print Official Form",
        newSession: "Start New Session",
        devisCheckout: "Devis / Checkout",
        savePatient: "Save Patient Data",
        cancel: "Cancel"
    },
    ar: {
        dashboardGroup: "لوحة التحكم المؤسسية",
        dashboard: "الرئيسية",
        appointments: "حجز المواعيد",
        patients: "إدارة المرضى",
        settings: "إعدادات العيادة",
        linkdentGroup: "Linkdent",
        odontogram: "مخطط الأسنان",
        prescriptions: "الوصفات الطبية",
        certificates: "الشهادات الطبية",
        expenses: "المصاريف",
        mutuelleTitle: "التأمين الصحي والتعاضديات",
        selectPatient: "اختر المريض من السجلات",
        editData: "تعديل البيانات",
        printForm: "طباعة ورقة العلاج الرسمية",
        newSession: "بدء جلسة علاج جديدة",
        devisCheckout: "الفاتورة والتقدير (Devis)",
        savePatient: "حفظ بيانات المريض",
        cancel: "إلغاء"
    },
    fr: {
        dashboardGroup: "Tableau de Bord",
        dashboard: "Accueil",
        appointments: "Rendez-vous",
        patients: "Gestion des Patients",
        settings: "Paramètres de la Clinique",
        linkdentGroup: "Linkdent",
        odontogram: "Odontogramme",
        prescriptions: "Ordonnances",
        certificates: "Certificats Médicaux",
        expenses: "Dépenses",
        mutuelleTitle: "Mutuelle & Assurances",
        selectPatient: "Sélectionner un patient",
        editData: "Modifier les données",
        printForm: "Imprimer la feuille de soins",
        newSession: "Démarrer une nouvelle séance",
        devisCheckout: "Devis / Facturation",
        savePatient: "Enregistrer",
        cancel: "Annuler"
    },
    es: {
        dashboardGroup: "Panel Corporativo",
        dashboard: "Inicio",
        appointments: "Citas",
        patients: "Gestión de Pacientes",
        settings: "Ajustes Clínicos",
        linkdentGroup: "Linkdent",
        odontogram: "Odontograma",
        prescriptions: "Recetas",
        certificates: "Certificados Médicos",
        expenses: "Gastos",
        mutuelleTitle: "Mutuas y Seguros",
        selectPatient: "Seleccionar paciente",
        editData: "Editar datos",
        printForm: "Imprimir formato oficial",
        newSession: "Iniciar nueva sesión",
        devisCheckout: "Presupuesto / Caja",
        savePatient: "Guardar paciente",
        cancel: "Cancelar"
    }
};

// دالة الترجمة الذكية
export const t = (key) => {
    const lang = localStorage.getItem('linkdent_lang') || 'en'; // الإنجليزية هي الافتراضية
    return translations[lang]?.[key] || translations['en']?.[key] || key;
};