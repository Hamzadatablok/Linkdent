import { memo, useState } from 'react'; 
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { IconButton, Menu, MenuItem, Tooltip, Stack, Divider } from '@mui/material';
import { IconSettings, IconLanguage } from '@tabler/icons-react';

// project imports
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import { drawerWidth } from 'store/constant';

// 🔥 قاموس ترجمة محلي (بدون مكتبات خارجية لتفادي أي أخطاء) 🔥
const translations = {
  en: { settings: "Settings", language: "Language" },
  ar: { settings: "الإعدادات", language: "اللغة" },
  fr: { settings: "Paramètres", language: "Langue" },
  es: { settings: "Configuraciones", language: "Idioma" }
};

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  // نظام اللغة المحلي المربوط بذاكرة المتصفح
  const [lang, setLang] = useState(localStorage.getItem('linkdent_lang') || 'en');
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  
  // دالة الترجمة البسيطة
  const t = (key) => translations[lang][key];

  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);
  
  const changeLanguage = (newLang) => {
    localStorage.setItem('linkdent_lang', newLang);
    setLang(newLang);
    handleLangClose();
    // تحديث الصفحة فوراً لتطبيق اللغة على باقي المنصة
    window.location.reload(); 
  };

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }}>
      <Drawer
        variant={downMD ? 'temporary' : 'persistent'}
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(!drawerOpen)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
            bgcolor: 'transparent', // نحافظ على الشفافية لكي لا نخرب الزجاج!
            borderRight: '1px solid rgba(255,255,255,0.05)'
          }
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <LogoSection />
          </Box>
          <MenuList />
        </Box>

        {/* الجزء السفلي الثابت (الإعدادات واللغة) */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            
            <Tooltip title={t('settings')} placement="top">
              <IconButton sx={{ color: '#94a3b8', transition: 'all 0.3s', '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' } }}>
                <IconSettings size={24} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <Tooltip title={t('language')} placement="top">
              <IconButton onClick={handleLangClick} sx={{ color: '#94a3b8', transition: 'all 0.3s', '&:hover': { color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}>
                <IconLanguage size={24} />
              </IconButton>
            </Tooltip>

            <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={handleLangClose} PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff', borderRadius: 2, mt: -1 } }}>
              <MenuItem onClick={() => changeLanguage('en')} selected={lang === 'en'}>🇬🇧 English</MenuItem>
              <MenuItem onClick={() => changeLanguage('ar')} selected={lang === 'ar'}>🇲🇦 العربية</MenuItem>
              <MenuItem onClick={() => changeLanguage('fr')} selected={lang === 'fr'}>🇫🇷 Français</MenuItem>
              <MenuItem onClick={() => changeLanguage('es')} selected={lang === 'es'}>🇪🇸 Español</MenuItem>
            </Menu>

          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

export default memo(Sidebar);