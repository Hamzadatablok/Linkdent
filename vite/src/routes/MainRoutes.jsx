import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from './AuthGuard'; 

// هيكل الآدمن الجديد
import AdminLayout from 'views/super-admin/AdminLayout'; 

// ==============================|| MODULES IMPORT ||============================== //
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const Patients = Loadable(lazy(() => import('views/linkdent/Patients')));
const Settings = Loadable(lazy(() => import('views/linkdent/Settings')));
const Appointments = Loadable(lazy(() => import('views/linkdent/Appointments')));
const Odontogram = Loadable(lazy(() => import('views/linkdent/Odontogram')));
const Ordonnances = Loadable(lazy(() => import('views/linkdent/Ordonnances')));
const Certificats = Loadable(lazy(() => import('views/linkdent/Certificats')));
const Depenses = Loadable(lazy(() => import('views/linkdent/Depenses')));
const Mutuelle = Loadable(lazy(() => import('views/linkdent/Mutuelle')));

const SuperDashboard = Loadable(lazy(() => import('views/super-admin/SuperDashboard')));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  children: [
    // 🟢 القسم الأول: لوحة الأطباء
    {
      path: '/',
      element: <AuthGuard><MainLayout /></AuthGuard>,
      children: [
        { path: '/', element: <DashboardDefault /> },
        {
          path: 'dashboard',
          children: [
            { path: 'default', element: <DashboardDefault /> },
            { path: 'patients', element: <Patients /> },
            { path: 'settings', element: <Settings /> },
            { path: 'appointments', element: <Appointments /> }
          ]
        },
        {
          path: 'linkdent',
          children: [
            { path: 'odontogram', element: <Odontogram /> },
            { path: 'ordonnances', element: <Ordonnances /> },
            { path: 'certificats', element: <Certificats /> },
            { path: 'depenses', element: <Depenses /> },
            { path: 'mutuelle', element: <Mutuelle /> }
          ]
        }
      ]
    },
    // 👑 القسم الثاني: لوحة الآدمن المركزية (تم إصلاح جميع المسارات هنا) 👑
    {
      path: '/admin',
      element: <AuthGuard><AdminLayout /></AuthGuard>,
      children: [
        { path: 'dashboard', element: <SuperDashboard /> },
        { path: 'default', element: <SuperDashboard /> },
        { path: 'clinics', element: <SuperDashboard /> },
        { path: 'billing', element: <SuperDashboard /> },
        { path: 'settings', element: <SuperDashboard /> }
      ]
    }
  ]
};

export default MainRoutes;