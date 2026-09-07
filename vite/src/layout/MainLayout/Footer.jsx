import { Stack, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center" 
      sx={{ p: 2, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Typography variant="subtitle2" color="textSecondary">
        &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لـ{' '}
        <Link href="#" underline="hover" sx={{ color: '#673ab7', fontWeight: 600 }}>
          Linkdent
        </Link>
      </Typography>
      
      <Typography variant="subtitle2" color="textSecondary">
        نسخة v5.1.0
      </Typography>
    </Stack>
  );
}