import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IconDashboard, IconBuildingHospital, IconCreditCard, IconSettings, IconLogout } from '@tabler/icons-react';
import { useAppContext } from '../../AppContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useAppContext();

  // أيقونات وأقسام الآدمن
  const menuItems = [
    { title: 'Dashboard', icon: <IconDashboard color="#fbbf24" />, path: '/admin/dashboard' },
    { title: 'Clinics & Tenants', icon: <IconBuildingHospital color="#fbbf24" />, path: '/admin/clinics' },
    { title: 'Billing & Plans', icon: <IconCreditCard color="#fbbf24" />, path: '/admin/billing' },
    { title: 'Platform Settings', icon: <IconSettings color="#fbbf24" />, path: '/admin/settings' },
  ];

  return (
    <Box className="admin-theme" sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617' }}>
      
      {/* 🔥 الدرع الصارم: سحق البياض والظلال، وفرض الأزرق الداكن والذهبي 🔥 */}
      <style>{`
        /* إجبار كل البطاقات والأزرار على الأزرق الداكن وإزالة التوهج الأبيض */
        .admin-theme .MuiPaper-root, 
        .admin-theme .MuiCard-root,
        .admin-theme .MuiButton-root {
          background-color: #0f172a !important; 
          box-shadow: none !important; 
          border: 1px solid rgba(251, 191, 36, 0.2) !important;
          background-image: none !important;
        }

        /* 🔥 تدمير بياض القائمة الجانبية الذي تسلل من النيومورفيزم 🔥 */
        .admin-theme .MuiList-root {
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
        }

        /* تفريغ الجداول من أي خلفية */
        .admin-theme table, .admin-theme th, .admin-theme td {
          background-color: transparent !important;
          color: #ffffff !important;
          border-bottom: 1px solid rgba(251, 191, 36, 0.1) !important;
        }
        
        /* رؤوس الجداول بالذهبي */
        .admin-theme th { 
          color: #fbbf24 !important; 
          font-weight: 900 !important; 
          text-transform: uppercase; 
        }

        /* كل النصوص بيضاء */
        .admin-theme h1, .admin-theme h2, .admin-theme h3, .admin-theme h4, .admin-theme h5, .admin-theme h6, .admin-theme p, .admin-theme span {
          color: #ffffff !important;
        }

        /* تصميم الزر النشط في القائمة الجانبية (خلفية شفافة مع خط ذهبي) */
        .admin-sidebar .MuiListItemButton-root.Mui-selected {
          background-color: rgba(251, 191, 36, 0.1) !important;
          border-right: 4px solid #fbbf24 !important;
          border-radius: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
        .admin-sidebar .MuiListItemButton-root.Mui-selected span {
          color: #ffffff !important;
          font-weight: 900 !important;
        }
        .admin-sidebar .MuiListItemButton-root.Mui-selected svg {
          color: #fbbf24 !important;
        }
      `}</style>

      {/* القائمة الجانبية (الأزرق الداكن الصارخ) */}
      <Box className="admin-sidebar" sx={{ width: 280, flexShrink: 0, backgroundColor: '#0f172a', borderRight: '1px solid rgba(251, 191, 36, 0.2)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 900, letterSpacing: 2 }}>LINK<span style={{ color: '#fbbf24' }}>DENT</span></Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1 }}>SUPER ADMIN</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(251, 191, 36, 0.2)', mb: 2 }} />
        
        <List sx={{ flexGrow: 1, px: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname.includes(item.path)}
                onClick={() => navigate(item.path)}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05) !important' } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} sx={{ '& span': { color: '#ffffff', fontWeight: 600 } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 3 }}>
          <ListItemButton onClick={logoutUser} sx={{ borderRadius: 2, border: '1px solid #ef4444 !important', backgroundColor: 'transparent !important', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1) !important' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}><IconLogout color="#ef4444" /></ListItemIcon>
            <ListItemText primary="System Logout" sx={{ '& span': { color: '#ef4444', fontWeight: 'bold' } }} />
          </ListItemButton>
        </Box>
      </Box>

      {/* ساحة العمل الرئيسية */}
      <Box sx={{ flexGrow: 1, p: 4, height: '100vh', overflow: 'auto', backgroundColor: '#020617' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;