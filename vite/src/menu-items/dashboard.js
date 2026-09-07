// 🔥 تم إضافة IconShieldCheck هنا في الاستدعاء 🔥
import { IconDashboard, IconUsers, IconSettings, IconCalendarTime, IconShieldCheck } from '@tabler/icons-react';
import { t } from '../utils/dictionary'; 

// 🔥 تم إضافتها للقائمة هنا أيضاً 🔥
const icons = { IconDashboard, IconUsers, IconSettings, IconCalendarTime, IconShieldCheck };

const dashboard = {
  id: 'dashboard',
  title: 'لوحة التحكم المؤسسية',
  type: 'group',
  children: [
    {
      id: 'default',
      title: t('dashboard'),
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'appointments',
      title: t('appointments'),
      type: 'item',
      url: '/dashboard/appointments', 
      icon: icons.IconCalendarTime,
      breadcrumbs: false
    },
    {
      id: 'patients',
      title: t('patients'),
      type: 'item',
      url: '/dashboard/patients',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: t('settings'),
      type: 'item',
      url: '/dashboard/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    },
    {
      id: 'mutuelle',
      title: 'Mutuelle & Assurances',
      type: 'item',
      url: '/linkdent/mutuelle',
      icon: icons.IconShieldCheck, // الآن ستعمل الأيقونة بدون مشاكل
      breadcrumbs: false
    }
  ]
};

export default dashboard;