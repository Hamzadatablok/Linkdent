import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

export default function PopularCard({ isLoading }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [recentPatients, setRecentPatients] = useState([]);

  // جلب آخر 4 مرضى
  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem('linkdent_patients')) || [];
    setRecentPatients(patients.slice(-4).reverse());
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Stack sx={{ gap: gridSpacing }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">أحدث المرضى المسجلين</Typography>
                <IconButton size="small" sx={{ mt: -0.625 }}>
                  <MoreHorizOutlinedIcon fontSize="small" sx={{ cursor: 'pointer' }} aria-controls="menu-popular-card" aria-haspopup="true" onClick={handleClick} />
                </IconButton>
              </Stack>
              <Menu id="menu-popular-card" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} variant="selectedMenu" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={handleClose}> اليوم</MenuItem>
                <MenuItem onClick={handleClose}> هذا الشهر</MenuItem>
              </Menu>

              <BajajAreaChartCard />
              
              <Box>
                {recentPatients.length > 0 ? recentPatients.map((patient, index) => (
                  <React.Fragment key={index}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                        {patient.firstName} {patient.lastName}
                      </Typography>
                      <Stack direction="row" sx={{ alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                          ملف: #{patient.id}
                        </Typography>
                        <Avatar variant="rounded" sx={{ width: 16, height: 16, borderRadius: '5px', bgcolor: 'success.light', color: 'success.dark', ml: 2 }}>
                          <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                        </Avatar>
                      </Stack>
                    </Stack>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                      CIN: {patient.cin || 'غير متوفر'}
                    </Typography>
                    {index < recentPatients.length - 1 && <Divider sx={{ my: 1.5 }} />}
                  </React.Fragment>
                )) : (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center', mt: 2 }}>لا يوجد مرضى مسجلين بعد.</Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              عرض الكل (View All)
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = { isLoading: PropTypes.bool };