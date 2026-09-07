import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Grid, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, IconButton, Chip, Autocomplete, Divider
} from '@mui/material';
import { 
  IconPlus, IconChevronRight, IconChevronLeft, IconClock, IconUser, IconStethoscope
} from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';

const Appointments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const todayDate = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(todayDate);
  
  const [patientsDatabase, setPatientsDatabase] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const defaultServices = ['Initial Consultation', 'Extraction', 'Teeth Whitening', 'Control (Braces)', 'Dental Implant', 'Root Canal Treatment'];

  const [newAppointment, setNewAppointment] = useState({
    date: todayDate, time: '09:00', patientName: '', type: '', status: 'Confirmed'
  });

  useEffect(() => {
    const savedPatients = localStorage.getItem('linkdent_patients');
    if (savedPatients) {
      const parsedPatients = JSON.parse(savedPatients);
      setPatientsDatabase(parsedPatients.map(p => ({
        id: p.id,
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        cin: p.cin || 'No ID'
      })));
    }

    const savedAppointments = localStorage.getItem('linkdent_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointmentsToDB = (updatedAppointments) => {
    setAppointments(updatedAppointments);
    localStorage.setItem('linkdent_appointments', JSON.stringify(updatedAppointments));
  };

  const generateWorkingHours = () => {
    const hours = [];
    for (let i = 7; i <= 24; i++) {
      const hourStr = i === 24 ? '00' : String(i).padStart(2, '0');
      hours.push(`${hourStr}:00`);
      if (i !== 24) hours.push(`${hourStr}:30`);
    }
    return hours;
  };
  const workingHours = generateWorkingHours();

  const handleSaveAppointment = () => {
    if (newAppointment.date && newAppointment.time && newAppointment.patientName) {
      const updatedAppointments = [...appointments, { ...newAppointment, id: Date.now() }];
      saveAppointmentsToDB(updatedAppointments);
      setIsModalOpen(false);
      setNewAppointment({ date: currentDate, time: '09:00', patientName: '', type: '', status: 'Confirmed' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <MainCard title="Appointments & Medical Agenda">
        
        <Box sx={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, p: 2.5, 
          bgcolor: '#e0e5ec', borderRadius: 3, 
          boxShadow: '5px 5px 10px rgba(163, 177, 198, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.8)' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="primary" sx={{ bgcolor: '#fff', boxShadow: '2px 2px 5px rgba(0,0,0,0.05)' }}><IconChevronLeft /></IconButton>
            
            <TextField 
              type="date" 
              size="small"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              sx={{ 
                bgcolor: '#fff', borderRadius: 2, width: '180px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                boxShadow: 'inset 2px 2px 5px rgba(163, 177, 198, 0.3)'
              }}
            />

            <IconButton color="primary" sx={{ bgcolor: '#fff', boxShadow: '2px 2px 5px rgba(0,0,0,0.05)' }}><IconChevronRight /></IconButton>
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<IconPlus />} 
            onClick={() => {
              setNewAppointment({...newAppointment, date: currentDate});
              setIsModalOpen(true);
            }}
            sx={{ px: 4, borderRadius: 2 }}
          >
            Book New Appointment
          </Button>
        </Box>

        <Paper elevation={0} sx={{ 
          p: 3, bgcolor: '#e0e5ec', borderRadius: 3,
          boxShadow: 'inset 5px 5px 10px rgba(163, 177, 198, 0.4), inset -5px -5px 10px rgba(255, 255, 255, 0.7)' 
        }}>
          {workingHours.map((slot) => {
            const slotAppointments = appointments.filter(app => {
              if (app.date !== currentDate) return false;
              
              const appHour = parseInt(app.time.split(':')[0]);
              const appMinute = parseInt(app.time.split(':')[1]);
              const slotHour = parseInt(slot.split(':')[0]);
              const slotMinute = parseInt(slot.split(':')[1]);
              
              return appHour === slotHour && (
                (slotMinute === 0 && appMinute < 30) || 
                (slotMinute === 30 && appMinute >= 30)
              );
            });
            
            return (
              <Box key={slot} sx={{ display: 'flex', borderBottom: '1px solid rgba(163, 177, 198, 0.3)', py: 2.5, '&:last-child': { borderBottom: 'none' } }}>
                <Box sx={{ width: '110px', flexShrink: 0, pt: 1 }}>
                  <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                    <IconClock size={18} /> {slot}
                  </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, minHeight: '70px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {slotAppointments.length > 0 ? (
                    slotAppointments.map(app => (
                      <Box key={app.id} sx={{ 
                        p: 2.5, bgcolor: '#fff', borderRadius: 2, 
                        borderRight: '6px solid #5e35b1',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.3)' 
                      }}>
                        <Box>
                          <Typography variant="h4" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconUser size={20} color="#5e35b1" /> {app.patientName}
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconStethoscope size={18} /> {app.type} - Time: {app.time}
                          </Typography>
                        </Box>
                        <Chip label={app.status} color={getStatusColor(app.status)} sx={{ fontWeight: 'bold', px: 1, py: 2, borderRadius: 2 }} />
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', opacity: 0.4 }}>
                      <Typography variant="body1">-- Empty Slot --</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Paper>
      </MainCard>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: '#f8fafc' } }}
      >
        <DialogTitle sx={{ bgcolor: '#fff', pb: 2 }}>
          <Typography variant="h3" color="primary">Book New Medical Appointment</Typography>
        </DialogTitle>
        <Divider />
        
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Patient Details</Typography>
              <Autocomplete
                options={patientsDatabase}
                getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name} (CIN: ${option.cin})`}
                freeSolo
                onChange={(event, newValue) => setNewAppointment({...newAppointment, patientName: newValue ? (newValue.name || newValue) : ''})}
                onInputChange={(event, newInputValue) => setNewAppointment({...newAppointment, patientName: newInputValue})}
                renderInput={(params) => <TextField {...params} placeholder="Search by name or ID, or type a new name..." sx={{ bgcolor: '#fff' }} />}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Type of Medical Intervention</Typography>
              <Autocomplete
                options={defaultServices}
                freeSolo
                onChange={(event, newValue) => setNewAppointment({...newAppointment, type: newValue || ''})}
                onInputChange={(event, newInputValue) => setNewAppointment({...newAppointment, type: newInputValue})}
                renderInput={(params) => <TextField {...params} placeholder="Select service or type intervention details..." sx={{ bgcolor: '#fff' }} />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Appointment Date</Typography>
              <TextField 
                fullWidth type="date" 
                value={newAppointment.date} 
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} 
                sx={{ bgcolor: '#fff' }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Time</Typography>
              <TextField 
                fullWidth type="time" 
                value={newAppointment.time} 
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} 
                sx={{ bgcolor: '#fff' }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Appointment Status</Typography>
              <TextField 
                select fullWidth 
                value={newAppointment.status} 
                onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value})}
                sx={{ bgcolor: '#fff' }}
              >
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            </Grid>

          </Grid>
        </DialogContent>
        
        <Divider />
        <DialogActions sx={{ p: 3, bgcolor: '#fff' }}>
          <Button onClick={() => setIsModalOpen(false)} color="error" variant="outlined" sx={{ px: 3 }}>Cancel</Button>
          <Button onClick={handleSaveAppointment} variant="contained" color="primary" sx={{ px: 4, py: 1, fontSize: '1.1rem' }}>
            Confirm Booking in Agenda
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments;