// assets
import { 
    IconTypography, 
    IconPalette, 
    IconShadow, 
    IconWindmill, 
    IconStethoscope,
    IconDental, 
    IconPrescription, 
    IconCertificate, 
    IconReceipt2 
} from '@tabler/icons-react';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconStethoscope,
    IconDental,
    IconPrescription,
    IconCertificate,
    IconReceipt2
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Linkdent',
    type: 'group',
    children: [
        {
            id: 'odontogram',
            title: 'Odontogram',
            type: 'item',
            url: '/linkdent/odontogram',
            icon: icons.IconStethoscope,
            breadcrumbs: false
        },
        {
            id: 'ordonnances',
            title: 'Ordonnances',
            type: 'item',
            url: '/linkdent/ordonnances',
            icon: icons.IconPrescription,
            breadcrumbs: false
        },
        {
            id: 'certificats',
            title: 'Certificats Médicaux',
            type: 'item',
            url: '/linkdent/certificats',
            icon: icons.IconCertificate,
            breadcrumbs: false
        },
        {
            id: 'depenses',
            title: 'Dépenses',
            type: 'item',
            url: '/linkdent/depenses',
            icon: icons.IconReceipt2,
            breadcrumbs: false
        }
    ]
};

export default utilities;