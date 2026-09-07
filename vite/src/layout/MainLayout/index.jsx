import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Sidebar from './Sidebar';
import navigation from 'menu-items';

// استدعاء نظام القوائم الحديث
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const locationId = searchParams.get('location_id');
    const contactId = searchParams.get('contact_id');

    if (locationId) {
      sessionStorage.setItem('ghl_location_id', locationId);
      console.log('✅ تم التقاط وحفظ Location ID:', locationId);
    }
    
    if (contactId) {
      sessionStorage.setItem('ghl_contact_id', contactId);
      console.log('✅ تم التقاط وحفظ Contact ID:', contactId);
    }
  }, [searchParams]);

  // الحماية من القيمة الفارغة
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened === true;

  const handleLeftDrawerToggle = () => {
    handlerDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? drawerOpen : !drawerOpen} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Box component="main" sx={{ width: '100%', p: 3, pt: 4 }}>
        <Breadcrumbs separator={navigation} title titleBottom card={false} divider={false} />
        <Outlet />
      </Box>
    </Box>
  );
}