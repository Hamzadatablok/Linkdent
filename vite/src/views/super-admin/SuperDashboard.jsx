import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Card, CardContent, Avatar, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Stack, Tooltip,
  Tabs, Tab
} from '@mui/material';
import { 
  IconChartLine, IconBuildingHospital, IconUsers, IconCreditCard, IconPlus, 
  IconLogin, IconEdit, IconTrash, IconFileInvoice, IconAlertTriangle, IconCheck
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../AppContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const SuperDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { updateClinicSettings } = useAppContext();
  
  const [tabValue, setTabValue] = useState(0);
  const [clinics, setClinics] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ mrr: 0, active: 0, pending: 0, unpaid: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentClinic, setCurrentClinic] = useState({ name: '', doctor: '', plan: 'Premium', mrr: 1500, status: 'Active' });

  // التوجيه الذكي بين التبويبات بناءً على الأزرار الجانبية
  useEffect(() => {
    if (location.pathname.includes('billing')) {
      setTabValue(1); 
    } else {
      setTabValue(0); 
    }
  }, [location]);

  const calculateStats = (data) => {
    let totalMrr = 0, activeCount = 0, pendingCount = 0, unpaidCount = 0;
    data.forEach(clinic => {
      if (clinic.status === 'Active') { totalMrr += clinic.mrr; activeCount += 1; }
      else if (clinic.status === 'Pending') { pendingCount += 1; }
      else if (clinic.status.includes('Unpaid') || clinic.status === 'Suspended') { unpaidCount += 1; }
    });
    setStats({ mrr: totalMrr, active: activeCount, pending: pendingCount, unpaid: unpaidCount });
  };

  useEffect(() => {
    let savedClinics = JSON.parse(localStorage.getItem('linkdent_admin_clinics'));
    if (!savedClinics || savedClinics.length === 0) {
      savedClinics = [
        { id: 'LD-1001', name: 'Vitalia Dental Care', doctor: 'Dr. John Doe', plan: 'Premium', mrr: 1500, status: 'Active', date: '2026-01-15' },
        { id: 'LD-1002', name: 'Smile Clinic', doctor: 'Dr. Sarah', plan: 'Basic', mrr: 800, status: 'Active', date: '2026-03-20' },
        { id: 'LD-1003', name: 'Tanger Dent', doctor: 'Dr. Ahmed', plan: 'Trial', mrr: 0, status: 'Pending', date: '2026-08-10' },
        { id: 'LD-1004', name: 'City Center Dental', doctor: 'Dr. Youssef', plan: 'Premium', mrr: 1500, status: 'Suspended (Unpaid)', date: '2025-11-05' },
      ];
      localStorage.setItem('linkdent_admin_clinics', JSON.stringify(savedClinics));
    }
    setClinics(savedClinics);
    calculateStats(savedClinics);

    let savedInvoices = JSON.parse(localStorage.getItem('linkdent_admin_invoices'));
    if (!savedInvoices || savedInvoices.length === 0) {
      savedInvoices = [
        { id: 'INV-001', clinicId: 'LD-1001', clinicName: 'Vitalia Dental Care', period: 'August 2026', amount: 1500, status: 'Paid', dueDate: '2026-08-05' },
        { id: 'INV-002', clinicId: 'LD-1002', clinicName: 'Smile Clinic', period: 'August 2026', amount: 800, status: 'Pending', dueDate: '2026-08-25' },
        { id: 'INV-003', clinicId: 'LD-1004', clinicName: 'City Center Dental', period: 'July 2026', amount: 1500, status: 'Overdue', dueDate: '2026-07-05' },
      ];
      localStorage.setItem('linkdent_admin_invoices', JSON.stringify(savedInvoices));
    }
    setInvoices(savedInvoices);
  }, []);

  const handleImpersonate = (clinic) => {
    localStorage.setItem('linkdent_is_impersonating', 'true');
    const impersonatedSettings = {
        clinicId: clinic.id,
        clinicName: clinic.name,
        doctorName: clinic.doctor,
        specialty: "Dental Surgeon", 
        address: "Tangier, Morocco", 
        phone: "+212 600 000 000",
        email: `contact@${clinic.name.replace(/\s/g, '').toLowerCase()}.com`,
        logo: null,
        signature: null
    };
    updateClinicSettings(impersonatedSettings);
    navigate('/dashboard/default'); 
  };

  const handleSaveClinic = () => {
    if (!currentClinic.name || !currentClinic.doctor) {
        alert("⚠️ Please enter Clinic Name and Doctor Name.");
        return;
    }
    
    let updatedClinics;
    if (modalMode === 'add') {
      const newId = `LD-${1000 + clinics.length + 1}`;
      const addedClinic = { ...currentClinic, id: newId, date: new Date().toISOString().split('T')[0] };
      updatedClinics = [addedClinic, ...clinics];
    } else {
      updatedClinics = clinics.map(c => c.id === currentClinic.id ? currentClinic : c);
    }
    
    setClinics(updatedClinics);
    localStorage.setItem('linkdent_admin_clinics', JSON.stringify(updatedClinics));
    calculateStats(updatedClinics);
    setIsModalOpen(false);
  };

  const handleDeleteClinic = (id) => {
    if (window.confirm("⚠️ Are you sure you want to PERMANENTLY DELETE this clinic?")) {
      const updatedClinics = clinics.filter(c => c.id !== id);
      setClinics(updatedClinics);
      localStorage.setItem('linkdent_admin_clinics', JSON.stringify(updatedClinics));
      calculateStats(updatedClinics);
    }
  };

  const markAsPaid = (invoiceId) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) return { ...inv, status: 'Paid' };
      return inv;
    });
    setInvoices(updatedInvoices);
    localStorage.setItem('linkdent_admin_invoices', JSON.stringify(updatedInvoices));

    const paidInvoice = invoices.find(inv => inv.id === invoiceId);
    if (paidInvoice) {
      const updatedClinics = clinics.map(c => {
        if (c.id === paidInvoice.clinicId && c.status.includes('Suspended')) {
          return { ...c, status: 'Active' };
        }
        return c;
      });
      setClinics(updatedClinics);
      localStorage.setItem('linkdent_admin_clinics', JSON.stringify(updatedClinics));
      calculateStats(updatedClinics);
    }
  };

  // 🔥 إضافة زر التلاعب بالفواتير للتجارب 🔥
  const markAsUnpaid = (invoiceId) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) return { ...inv, status: 'Overdue' };
      return inv;
    });
    setInvoices(updatedInvoices);
    localStorage.setItem('linkdent_admin_invoices', JSON.stringify(updatedInvoices));
    
    // إرجاع العيادة إلى وضع Active لكي يتمكن زر التعليق من اكتشافها مجدداً
    const unpaidInvoice = invoices.find(inv => inv.id === invoiceId);
    if (unpaidInvoice) {
        const updatedClinics = clinics.map(c => {
          if (c.id === unpaidInvoice.clinicId) {
            return { ...c, status: 'Active' };
          }
          return c;
        });
        setClinics(updatedClinics);
        localStorage.setItem('linkdent_admin_clinics', JSON.stringify(updatedClinics));
        calculateStats(updatedClinics);
    }
  };

  const checkOverdueInvoices = () => {
    let suspendedCount = 0;
    const updatedClinics = clinics.map(clinic => {
      const hasOverdue = invoices.some(inv => inv.clinicId === clinic.id && inv.status === 'Overdue');
      if (hasOverdue && clinic.status === 'Active') {
        suspendedCount++;
        return { ...clinic, status: 'Suspended (Unpaid)' };
      }
      return clinic;
    });

    if (suspendedCount > 0) {
      setClinics(updatedClinics);
      localStorage.setItem('linkdent_admin_clinics', JSON.stringify(updatedClinics));
      calculateStats(updatedClinics);
      alert(`⚠️ Auto-Suspension Triggered! ${suspendedCount} clinic(s) have been suspended due to overdue unpaid invoices.`);
    } else {
      alert("✅ All active clinics are up to date with their payments.");
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Active' || status === 'Paid') return '#10b981';
    if (status === 'Pending') return '#f59e0b';
    return '#ef4444';
  };

  const inputStyle = { 
    mb: 3, 
    '& .MuiOutlinedInput-root': { backgroundColor: '#1e293b !important', color: '#ffffff !important', borderRadius: 2 }, 
    '& .MuiInputLabel-root': { color: '#94a3b8 !important' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(251, 191, 36, 0.2) !important' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24 !important' },
    '& .MuiSvgIcon-root': { color: '#fbbf24 !important' }
  };

  const darkMenuProps = {
    PaperProps: { sx: { backgroundColor: '#0f172a !important', color: '#ffffff !important', border: '1px solid rgba(251, 191, 36, 0.2) !important' } }
  };

  return (
    <Box sx={{ p: { xs: 0, md: 1 } }}>
      
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ color: '#ffffff', fontWeight: '900', letterSpacing: '1px' }}>
            Super Admin Control Center
          </Typography>
          <Typography variant="body1" sx={{ color: '#fbbf24', fontWeight: 'bold', mt: 0.5 }}>
            Linkdent SaaS Empire 👑
          </Typography>
        </Box>
        <Button 
          onClick={() => { setModalMode('add'); setCurrentClinic({ name: '', doctor: '', plan: 'Premium', mrr: 1500, status: 'Active' }); setIsModalOpen(true); }}
          variant="outlined" 
          sx={{ borderColor: '#fbbf24 !important', color: '#ffffff !important', fontWeight: 'bold', backgroundColor: '#0f172a !important', '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.1) !important' }, px: 3, py: 1 }} 
          startIcon={<IconPlus color="#fbbf24" />}
        >
          Onboard New Clinic
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderBottom: '4px solid #fbbf24 !important', bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 'bold', mb: 1 }}>Monthly Revenue (MRR)</Typography>
                  <Typography variant="h3" sx={{ color: '#fbbf24', fontWeight: 900 }}>{stats.mrr.toLocaleString()} MAD</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}><IconChartLine /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderBottom: '4px solid #10b981 !important', bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 'bold', mb: 1 }}>Active Clinics</Typography>
                  <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 900 }}>{stats.active}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><IconBuildingHospital /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderBottom: '4px solid #8b5cf6 !important', bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 'bold', mb: 1 }}>Trial / Pending Clinics</Typography>
                  <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: 900 }}>{stats.pending}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><IconUsers /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderBottom: '4px solid #ef4444 !important', bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 'bold', mb: 1 }}>Suspended / Unpaid</Typography>
                  <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 900 }}>{stats.unpaid}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><IconCreditCard /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 0, overflow: 'hidden', bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newVal) => setTabValue(newVal)} 
          sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', '& .MuiTab-root': { color: '#94a3b8', fontWeight: 'bold', py: 3 }, '& .Mui-selected': { color: '#fbbf24 !important' }, '& .MuiTabs-indicator': { backgroundColor: '#fbbf24' } }}
        >
          <Tab icon={<IconBuildingHospital size={20} />} iconPosition="start" label="Clinics Management" />
          <Tab icon={<IconFileInvoice size={20} />} iconPosition="start" label="Billing & Subscriptions" />
        </Tabs>

        {/* 🟢 التبويب 1: إدارة العيادات 🟢 */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Clinic ID</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Clinic Name</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Doctor</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Plan (MRR)</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clinics.map((clinic) => (
                  <TableRow key={clinic.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.05) !important' } }}>
                    <TableCell sx={{ color: '#ffffff !important', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{clinic.id}</TableCell>
                    <TableCell sx={{ color: '#ffffff !important', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{clinic.name}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1 !important', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{clinic.doctor}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1 !important', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {clinic.plan} <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>({clinic.mrr} MAD)</span>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip label={clinic.status} size="small" sx={{ backgroundColor: `${getStatusColor(clinic.status)}20 !important`, color: getStatusColor(clinic.status) + ' !important', fontWeight: 'bold' }} />
                    </TableCell>
                    
                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Login as Doctor">
                          <Button onClick={() => handleImpersonate(clinic)} variant="outlined" size="small" sx={{ borderColor: 'rgba(16, 185, 129, 0.5) !important', color: '#10b981 !important', minWidth: '40px', px: 1, '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1) !important' } }}>
                            <IconLogin size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Edit Plan & Status">
                          <Button onClick={() => { setModalMode('edit'); setCurrentClinic(clinic); setIsModalOpen(true); }} variant="outlined" size="small" sx={{ borderColor: '#fbbf24 !important', color: '#fbbf24 !important', minWidth: '40px', px: 1, '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.1) !important' } }}>
                            <IconEdit size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete Clinic">
                          <Button onClick={() => handleDeleteClinic(clinic.id)} variant="outlined" size="small" sx={{ borderColor: 'rgba(239, 68, 68, 0.5) !important', color: '#ef4444 !important', minWidth: '40px', px: 1, '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1) !important' } }}>
                            <IconTrash size={18} />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 🟢 التبويب 2: إدارة الفواتير والاشتراكات 🟢 */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(239, 68, 68, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
             <Typography sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconAlertTriangle color="#ef4444" size={20} /> Auto-Suspend System
             </Typography>
             <Button variant="contained" color="error" onClick={checkOverdueInvoices} sx={{ fontWeight: 'bold' }}>
                Check Overdue & Suspend Clinics
             </Button>
          </Box>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Invoice ID</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Clinic Name</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Billing Period</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Amount</TableCell>
                  <TableCell sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                    <TableCell sx={{ color: '#94a3b8 !important', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{inv.id}</TableCell>
                    <TableCell sx={{ color: '#ffffff !important', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{inv.clinicName}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1 !important', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{inv.period}<br/><span style={{fontSize:'0.75rem', color:'#64748b'}}>Due: {inv.dueDate}</span></TableCell>
                    <TableCell sx={{ color: '#ffffff !important', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{inv.amount} MAD</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip label={inv.status} size="small" sx={{ backgroundColor: `${getStatusColor(inv.status)}20 !important`, color: getStatusColor(inv.status) + ' !important', fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {inv.status !== 'Paid' ? (
                        <Button onClick={() => markAsPaid(inv.id)} variant="outlined" size="small" sx={{ borderColor: '#10b981 !important', color: '#10b981 !important', '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1) !important' } }} startIcon={<IconCheck size={16}/>}>
                          Mark Paid
                        </Button>
                      ) : (
                        <Button onClick={() => markAsUnpaid(inv.id)} variant="outlined" size="small" color="error" sx={{ opacity: 0.6, '&:hover': {opacity: 1} }}>
                          Mark Unpaid (Test)
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#0f172a !important', color: '#ffffff !important', border: '1px solid rgba(251, 191, 36, 0.3) !important', borderRadius: 3, backgroundImage: 'none !important', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7) !important' } }}>
        <DialogTitle sx={{ color: '#fbbf24 !important', backgroundColor: '#0f172a !important', fontWeight: '900', borderBottom: '1px solid rgba(251, 191, 36, 0.1)', pb: 2 }}>
          {modalMode === 'add' ? 'Create New Tenant (Clinic)' : `Edit Clinic: ${currentClinic.id}`}
        </DialogTitle>
        <DialogContent sx={{ pt: 4, backgroundColor: '#0f172a !important' }}>
          <TextField fullWidth label="Clinic Name" value={currentClinic.name} onChange={(e) => setCurrentClinic({...currentClinic, name: e.target.value})} sx={inputStyle} autoFocus />
          <TextField fullWidth label="Doctor Name" value={currentClinic.doctor} onChange={(e) => setCurrentClinic({...currentClinic, doctor: e.target.value})} sx={inputStyle} />
          
          <Grid container spacing={2}>
              <Grid item xs={6}>
                  <TextField select fullWidth label="Subscription Plan" value={currentClinic.plan} onChange={(e) => { const p = e.target.value; setCurrentClinic({...currentClinic, plan: p, mrr: p === 'Premium' ? 1500 : p === 'Basic' ? 800 : 0}); }} sx={inputStyle} SelectProps={{ MenuProps: darkMenuProps }}>
                    <MenuItem value="Premium">Premium Plan</MenuItem>
                    <MenuItem value="Basic">Basic Plan</MenuItem>
                    <MenuItem value="Trial">Free Trial</MenuItem>
                  </TextField>
              </Grid>
              <Grid item xs={6}>
                  <TextField fullWidth label="MRR (MAD)" type="number" value={currentClinic.mrr} onChange={(e) => setCurrentClinic({...currentClinic, mrr: Number(e.target.value)})} sx={inputStyle} />
              </Grid>
          </Grid>

          <TextField select fullWidth label="Account Status" value={currentClinic.status} onChange={(e) => setCurrentClinic({...currentClinic, status: e.target.value})} sx={inputStyle} SelectProps={{ MenuProps: darkMenuProps }}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending Setup</MenuItem>
            <MenuItem value="Suspended (Unpaid)">Suspended (Unpaid)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(251, 191, 36, 0.1)', backgroundColor: '#0f172a !important' }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: '#94a3b8 !important' }}>Cancel</Button>
          <Button onClick={handleSaveClinic} variant="contained" sx={{ backgroundColor: '#fbbf24 !important', color: '#0f172a !important', fontWeight: 'bold', '&:hover': { backgroundColor: '#f59e0b !important' } }}>
            {modalMode === 'add' ? 'Deploy Clinic' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default SuperDashboard;