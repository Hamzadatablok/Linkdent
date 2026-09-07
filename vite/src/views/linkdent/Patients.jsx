import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, useTheme, IconButton, Grid, TextField, Chip, Tabs, Tab, Menu, Checkbox, 
  FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Card, CardContent, Stack, MenuItem
} from '@mui/material';
import { 
  IconPlus, IconEdit, IconTrash, IconSettings, IconUpload, IconArrowLeft,
  IconPrescription, IconCalendarEvent, IconFolder, IconGripHorizontal, 
  IconStethoscope, IconClock, IconActivity, IconFileDescription, IconReceipt, IconPrinter, IconShieldCheck, IconUser
} from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';

const BASE_TRAITEMENTS = {
  healthy: { id: 'healthy', label: 'Healthy', color: '#ffffff', stroke: '#cbd5e1' },
  caries: { id: 'caries', label: 'Caries', color: '#ef4444', stroke: '#b91c1c' },
  filling: { id: 'filling', label: 'Filling', color: '#3b82f6', stroke: '#1d4ed8' },
  crown: { id: 'crown', label: 'Crown', color: '#eab308', stroke: '#a16207' },
  endo: { id: 'endo', label: 'Endo Treatment', color: '#a855f7', stroke: '#7e22ce' },
  implant: { id: 'implant', label: 'Implant', color: '#0d9488', stroke: '#115e59' },
  extracted: { id: 'extracted', label: 'Extracted', color: '#94a3b8', stroke: '#475569' }
};

const QUADRANT_1 = [18, 17, 16, 15, 14, 13, 12, 11];
const QUADRANT_2 = [21, 22, 23, 24, 25, 26, 27, 28];
const QUADRANT_4 = [48, 47, 46, 45, 44, 43, 42, 41];
const QUADRANT_3 = [31, 32, 33, 34, 35, 36, 37, 38];

const MOROCCAN_INSURANCES = [
  { id: 'None', name: 'No Insurance / Private', color: '#64748b' },
  { id: 'CNSS', name: 'CNSS / AMO', color: '#f59e0b' },
  { id: 'CNOPS', name: 'CNOPS', color: '#10b981' },
  { id: 'FAR', name: 'Mutuelle des FAR', color: '#475569' },
  { id: 'Sanlam', name: 'Sanlam', color: '#3b82f6' },
  { id: 'Wafa', name: 'Wafa Assurance', color: '#eab308' },
  { id: 'AXA', name: 'AXA Assurance', color: '#020617' },
  { id: 'RMA', name: 'RMA Watanya', color: '#3f6212' },
  { id: 'Allianz', name: 'Allianz', color: '#1e3a8a' },
];

const DentAnatomiqueView = ({ number, isUpper, toothData }) => {
  const getColor = (surface) => toothData?.[surface] ? BASE_TRAITEMENTS[toothData[surface]]?.color || '#fff' : BASE_TRAITEMENTS.healthy.color;
  const getStroke = (surface) => toothData?.[surface] ? BASE_TRAITEMENTS[toothData[surface]]?.stroke || '#cbd5e1' : BASE_TRAITEMENTS.healthy.stroke;
  const isExtracted = toothData?.center === 'extracted';
  const isImplant = toothData?.root === 'implant';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 0.2 }}>
      {isUpper && <Typography variant="caption" sx={{ fontWeight: '800', mb: 0.5, color: '#64748b' }}>{number}</Typography>}
      <Box sx={{ width: 35, height: 70, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.05))' }}>
        <svg viewBox="0 0 100 140" width="100%" height="100%">
          {isUpper ? (
            <g>
              <path d="M 25,50 Q 35,10 50,25 Q 65,10 75,50 Z" fill={getColor('root')} stroke={getStroke('root')} strokeWidth="2.5" />
              <polygon points="20,50 80,50 65,70 35,70" fill={getColor('top')} stroke={getStroke('top')} strokeWidth="2" />
              <polygon points="35,100 65,100 80,120 20,120" fill={getColor('bottom')} stroke={getStroke('bottom')} strokeWidth="2" />
              <polygon points="20,50 35,70 35,100 20,120" fill={getColor('left')} stroke={getStroke('left')} strokeWidth="2" />
              <polygon points="80,50 65,70 65,100 80,120" fill={getColor('right')} stroke={getStroke('right')} strokeWidth="2" />
              <polygon points="35,70 65,70 65,100 35,100" fill={getColor('center')} stroke={getStroke('center')} strokeWidth="2" />
            </g>
          ) : (
            <g>
              <polygon points="20,20 80,20 65,40 35,40" fill={getColor('top')} stroke={getStroke('top')} strokeWidth="2" />
              <polygon points="35,70 65,70 80,90 20,90" fill={getColor('bottom')} stroke={getStroke('bottom')} strokeWidth="2" />
              <polygon points="20,20 35,40 35,70 20,90" fill={getColor('left')} stroke={getStroke('left')} strokeWidth="2" />
              <polygon points="80,20 65,40 65,70 80,90" fill={getColor('right')} stroke={getStroke('right')} strokeWidth="2" />
              <polygon points="35,40 65,40 65,70 35,70" fill={getColor('center')} stroke={getStroke('center')} strokeWidth="2" />
              <path d="M 25,90 Q 35,130 50,110 Q 65,130 75,90 Z" fill={getColor('root')} stroke={getStroke('root')} strokeWidth="2.5" />
            </g>
          )}
          {isImplant && (
            <g transform={isUpper ? "translate(35, 15)" : "translate(35, 95)"}>
              <rect x="5" y="0" width="20" height="8" fill="#e2e8f0" stroke="#64748b" rx="2" />
              <line x1="15" y1="5" x2="15" y2="25" stroke="#475569" strokeWidth="4" strokeDasharray="2,2" />
            </g>
          )}
          {isExtracted && <path d="M 15,30 L 85,110 M 85,30 L 15,110" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" opacity="0.9" />}
        </svg>
      </Box>
      {!isUpper && <Typography variant="caption" sx={{ fontWeight: '800', mt: 0.5, color: '#64748b' }}>{number}</Typography>}
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Patients = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState('table');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  
  const [columns, setColumns] = useState([
    { id: 'id', label: 'File No.', visible: true, system: true },
    { id: 'lastName', label: 'Last Name', visible: true, system: false },
    { id: 'firstName', label: 'First Name', visible: true, system: false },
    { id: 'cin', label: 'ID Number (CIN)', visible: true, system: false },
    { id: 'phone', label: 'Contact Number', visible: true, system: false },
    { id: 'mutuelle', label: 'Insurance (Mutuelle)', visible: true, system: false, type: 'insurance_selector' },
    { id: 'matricule', label: 'Matricule (Registration No.)', visible: true, system: false },
    { id: 'kinship', label: 'Relationship (صلة القرابة)', visible: true, system: false, type: 'select', options: ['Insured (المؤمن له)', 'Spouse (الزوج/ة)', 'Child (الابن/ة)'] },
    { id: 'lastVisit', label: 'Last Visit', visible: true, system: true },
  ]);

  const [patients, setPatients] = useState([]);
  const [globalAppointments, setGlobalAppointments] = useState([]);
  const [globalOdontograms, setGlobalOdontograms] = useState([]);
  const [globalOrdonnances, setGlobalOrdonnances] = useState([]);
  const [globalCertificates, setGlobalCertificates] = useState([]);
  const [globalInvoices, setGlobalInvoices] = useState([]);
  
  const [newPatient, setNewPatient] = useState({});
  const [newColumnName, setNewColumnName] = useState('');
  const [draggedColumnId, setDraggedColumnId] = useState(null);

  useEffect(() => {
  const loadPatients = async () => {
    try {
      const token = localStorage.getItem('linkdent_token');

      const response = await fetch('http://localhost:10000/api/patients', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load patients');
      }

      const patientsFromApi = Array.isArray(data.patients)
        ? data.patients
        : Object.values(data.patients || {});

      setPatients(patientsFromApi);

    } catch (error) {
      console.error('Error loading patients:', error);
      setPatients([]);
    }
  };

  loadPatients();

  if (localStorage.getItem('linkdent_appointments')) {
    setGlobalAppointments(
      JSON.parse(localStorage.getItem('linkdent_appointments'))
    );
  }

  if (localStorage.getItem('linkdent_odontograms')) {
    setGlobalOdontograms(
      JSON.parse(localStorage.getItem('linkdent_odontograms'))
    );
  }

  if (localStorage.getItem('linkdent_ordonnances')) {
    setGlobalOrdonnances(
      JSON.parse(localStorage.getItem('linkdent_ordonnances'))
    );
  }

  if (localStorage.getItem('linkdent_certificates')) {
    setGlobalCertificates(
      JSON.parse(localStorage.getItem('linkdent_certificates'))
    );
  }

  if (localStorage.getItem('linkdent_invoices')) {
    setGlobalInvoices(
      JSON.parse(localStorage.getItem('linkdent_invoices'))
    );
  }
}, []);

  const savePatientsToDB = (updatedPatients) => {
    setPatients(updatedPatients);
    localStorage.setItem('linkdent_patients', JSON.stringify(updatedPatients));
  };

  const handleDragStart = (e, id) => { setDraggedColumnId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => e.preventDefault(); 
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedColumnId === targetId) return;
    const newColumns = [...columns];
    const draggedIndex = newColumns.findIndex(col => col.id === draggedColumnId);
    const targetIndex = newColumns.findIndex(col => col.id === targetId);
    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);
    setColumns(newColumns);
    setDraggedColumnId(null);
  };

  const handleOpenProfile = (patient) => {
    setSelectedPatient(patient);
    setViewMode('profile');
  };

  const handleBackToTable = () => {
    setSelectedPatient(null);
    setViewMode('table');
    setTabValue(0);
  };

  const handleSavePatient = async () => {
  try {
    const token = localStorage.getItem('linkdent_token');

    if (!token) {
      alert('❌ انتهت جلسة الدخول. يرجى تسجيل الدخول من جديد.');
      return;
    }

    if (modalMode === 'add') {
      const newId = (
        patients.length > 0
          ? Math.max(...patients.map((p) => parseInt(p.id) || 0)) + 1
          : 1001
      ).toString();

      const patientToAdd = {
        ...newPatient,
        id: newId,
        lastVisit: 'Today',
        nextVisit: 'Not Set',
        medicalHistory: '',
        documents: [],
        prescriptions: []
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:10000'}/api/patients`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(patientToAdd)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add patient');
      }

      const savedPatient = data.patient;

      setPatients((prevPatients) => [
        savedPatient,
        ...prevPatients
      ]);

      alert('✅ تم حفظ المريض بنجاح في قاعدة البيانات.');

    } else {
      const updatedPatients = patients.map((p) =>
        p.id === newPatient.id ? newPatient : p
      );

      setPatients(updatedPatients);

      if (selectedPatient && selectedPatient.id === newPatient.id) {
        setSelectedPatient(newPatient);
      }

      alert('✅ تم تحديث بيانات المريض محليًا.');
    }

    setIsPatientModalOpen(false);
    setNewPatient({});

  } catch (error) {
    console.error('Error saving patient:', error);
    alert(`❌ حدث خطأ أثناء حفظ المريض: ${error.message}`);
  }
};

  const handleSaveNewColumn = () => {
    if (newColumnName.trim()) {
      const newColId = `custom_${Date.now()}`;
      setColumns([...columns, { id: newColId, label: newColumnName, visible: true, system: false }]);
      setIsAddColumnModalOpen(false);
      setNewColumnName('');
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0] && selectedPatient) {
      const fileName = e.target.files[0].name;
      const updatedPatient = { ...selectedPatient, documents: [...(selectedPatient.documents || []), fileName] };
      const updatedPatientsList = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
      savePatientsToDB(updatedPatientsList);
      setSelectedPatient(updatedPatient);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleColumnMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleColumnMenuClose = () => setAnchorEl(null);
  const toggleColumnVisibility = (columnId) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, visible: !col.visible } : col));
  };

  const patientFullName = selectedPatient ? `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim() : '';
  const patientAppointments = selectedPatient ? globalAppointments.filter(app => app.patientName === patientFullName) : [];
  const patientOdontogram = selectedPatient ? globalOdontograms.find(od => String(od.patientId) === String(selectedPatient.id)) : null;
  const patientOrdonnancesList = selectedPatient ? globalOrdonnances.filter(ord => String(ord.patientId) === String(selectedPatient.id)) : [];
  const patientCertificates = selectedPatient ? globalCertificates.filter(cert => String(cert.patientId) === String(selectedPatient.id)) : [];
  const patientInvoices = selectedPatient ? globalInvoices.filter(inv => String(inv.patientId) === String(selectedPatient.id)) : [];

  const modalInputStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      transition: 'all 0.2s',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main }
  };

  return (
    <Box>
      {viewMode === 'profile' && selectedPatient ? (
        <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh', mx: -3, mt: -3 }}>
          <Button className="no-print" startIcon={<IconArrowLeft />} onClick={handleBackToTable} sx={{ mb: 3, fontWeight: 'bold' }}>
            Back to Patients List
          </Button>

          <MainCard className="no-print" sx={{ mb: 3, bgcolor: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: theme.palette.primary.light, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
                  {selectedPatient.firstName?.charAt(0) || 'P'}{selectedPatient.lastName?.charAt(0) || ''}
                </Box>
              </Grid>
              <Grid item xs>
                <Typography variant="h2" sx={{ mb: 1 }}>{patientFullName}</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                  <Chip icon={<IconFolder size={16}/>} label={`File #${selectedPatient.id}`} variant="outlined" />
                  <Chip label={`CIN: ${selectedPatient.cin || 'N/A'}`} variant="outlined" />
                  <Chip label={`Phone: ${selectedPatient.phone || 'N/A'}`} variant="outlined" />
                  {selectedPatient.mutuelle && selectedPatient.mutuelle !== 'No Insurance / Private' && selectedPatient.mutuelle !== 'None' && (
                    <Chip 
                      label={`${selectedPatient.mutuelle} | No: ${selectedPatient.matricule || 'N/A'} | ${selectedPatient.kinship || ''}`} 
                      color="primary" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                  )}
                </Box>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" color="primary" startIcon={<IconEdit />}
                  onClick={() => {
                    setModalMode('edit');
                    setNewPatient(selectedPatient);
                    setIsPatientModalOpen(true);
                  }}
                >
                  Edit Data
                </Button>
              </Grid>
            </Grid>
          </MainCard>

          <MainCard sx={{ minHeight: '60vh', border: 'none' }} className="no-print-border">
            <Tabs className="no-print" value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<IconStethoscope size={20} />} iconPosition="start" label="Diagnosis & Certificates" />
              <Tab icon={<IconActivity size={20} />} iconPosition="start" label="Odontogram" />
              <Tab icon={<IconUpload size={20} />} iconPosition="start" label="Attachments" />
              <Tab icon={<IconPrescription size={20} />} iconPosition="start" label="Prescriptions" />
              <Tab icon={<IconCalendarEvent size={20} />} iconPosition="start" label="Appointments" />
              <Tab icon={<IconReceipt size={20} />} iconPosition="start" label="Financial Invoices" sx={{ color: '#10b981' }} />
            </Tabs>

            <TabPanel value={tabValue} index={0} className="no-print">
              <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main }}>Doctor's Notes & Chronic Diseases</Typography>
              <TextField fullWidth multiline rows={4} defaultValue={selectedPatient.medicalHistory} variant="outlined" placeholder="Write your diagnosis and notes here..." sx={{ mb: 4 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Issued Medical Certificates</Typography>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/linkdent/certificats?patient_id=${selectedPatient.id}`)}>Issue New Certificate</Button>
              </Box>
              {patientCertificates.length > 0 ? (
                <Grid container spacing={2}>
                  {patientCertificates.map(cert => (
                    <Grid item xs={12} md={6} key={cert.id}>
                       <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff', borderRight: '4px solid #673ab7' }}>
                          <Typography variant="h5" sx={{ mb: 1 }}>Medical Certificate ({cert.restDays} days rest)</Typography>
                          <Typography variant="body2" color="textSecondary">Starting from: {cert.date}</Typography>
                          {cert.reason && <Typography variant="body2" sx={{ mt: 1 }}>Reason: {cert.reason}</Typography>}
                       </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">No medical certificates recorded.</Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Dental Map & Previous Interventions</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {patientOdontogram && (
                    <Button variant="outlined" color="primary" startIcon={<IconPrinter />} onClick={() => window.print()}>
                      Print Report / Export PDF
                    </Button>
                  )}
                  <Button variant="contained" color="secondary" startIcon={<IconActivity />} onClick={() => navigate(`/linkdent/odontogram?patient_id=${selectedPatient.id}`)}>
                    {patientOdontogram ? 'Update Odontogram' : 'Create New Odontogram'}
                  </Button>
                </Box>
              </Box>
              
              {patientOdontogram ? (
                <Box className="print-odontogram-report" sx={{ p: { xs: 2, md: 5 }, bgcolor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                  <Box sx={{ textAlign: 'center', mb: 5, pb: 3, borderBottom: '2px solid #f1f5f9' }}>
                      <Typography variant="h2" color="primary" sx={{ mb: 1, letterSpacing: 1 }}>Dental Condition & Diagnosis Report</Typography>
                      <Typography variant="h5" color="textSecondary">Odontogram & Treatments Report</Typography>
                      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                          <Grid item><Chip label={`Patient: ${patientFullName}`} sx={{ fontSize: '1rem', p: 1 }} /></Grid>
                          <Grid item><Chip label={`File No: ${selectedPatient.id}`} variant="outlined" sx={{ fontSize: '1rem', p: 1 }} /></Grid>
                          <Grid item><Chip label={`Report Date: ${patientOdontogram.lastUpdated || 'Today'}`} variant="outlined" sx={{ fontSize: '1rem', p: 1 }} /></Grid>
                      </Grid>
                  </Box>

                  <Box sx={{ mb: 5, p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" align="center" sx={{ mb: 2, color: '#94a3b8', fontWeight: '800' }}>UPPER MAXILLARY</Typography>
                      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                          <Stack direction="row">{QUADRANT_1.map(num => <DentAnatomiqueView key={num} number={num} isUpper={true} toothData={patientOdontogram.teethState[num]} />)}</Stack>
                          <Divider orientation="vertical" flexItem sx={{ mx: 2, borderWidth: 2 }} />
                          <Stack direction="row">{QUADRANT_2.map(num => <DentAnatomiqueView key={num} number={num} isUpper={true} toothData={patientOdontogram.teethState[num]} />)}</Stack>
                      </Stack>
                      <Divider sx={{ my: 3 }} />
                      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                          <Stack direction="row">{QUADRANT_4.map(num => <DentAnatomiqueView key={num} number={num} isUpper={false} toothData={patientOdontogram.teethState[num]} />)}</Stack>
                          <Divider orientation="vertical" flexItem sx={{ mx: 2, borderWidth: 2 }} />
                          <Stack direction="row">{QUADRANT_3.map(num => <DentAnatomiqueView key={num} number={num} isUpper={false} toothData={patientOdontogram.teethState[num]} />)}</Stack>
                      </Stack>
                      <Typography variant="subtitle2" align="center" sx={{ mt: 2, color: '#94a3b8', fontWeight: '800' }}>LOWER MANDIBLE</Typography>
                  </Box>

                  <Typography variant="h4" sx={{ mb: 3, color: '#334155' }}>Treatment Details (Détails des actes):</Typography>
                  {patientOdontogram.logs && patientOdontogram.logs.length > 0 ? (
                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                          <Table size="medium">
                              <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                  <TableRow>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Tooth No.</TableCell>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Surface</TableCell>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Procedure (Acte)</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {patientOdontogram.logs.map((log, index) => (
                                      <TableRow key={index} hover>
                                          <TableCell>{log.date}</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{log.tooth}</TableCell>
                                          <TableCell>{log.surface}</TableCell>
                                          <TableCell>
                                              <Chip 
                                                  label={log.acte} 
                                                  size="small" 
                                                  sx={{ 
                                                      bgcolor: BASE_TRAITEMENTS[log.acteId]?.color || '#f1f5f9',
                                                      color: (log.acteId === 'healthy' || log.acteId === 'eraser') ? '#333' : '#fff',
                                                      fontWeight: 'bold'
                                                  }} 
                                              />
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </TableContainer>
                  ) : (
                      <Typography variant="body1" color="textSecondary" align="center" sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
                          No detailed treatments recorded yet.
                      </Typography>
                  )}
                </Box>
              ) : (
                <Box className="no-print" sx={{ p: 5, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                  <IconActivity size={48} color="#94a3b8" />
                  <Typography variant="h5" sx={{ mt: 2, color: '#64748b' }}>No odontogram recorded currently.</Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2} className="no-print">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Attached Files ({(selectedPatient.documents || []).length})</Typography>
                <Button variant="contained" color="secondary" component="label" startIcon={<IconUpload />}>
                  Upload New File
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
              </Box>
              <Grid container spacing={2}>
                {(selectedPatient.documents || []).length === 0 && <Typography sx={{ p: 2, color: 'text.secondary' }}>No files uploaded.</Typography>}
                {(selectedPatient.documents || []).map((doc, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc' }}>
                      <Typography noWrap sx={{ maxWidth: '80%' }}>{doc}</Typography>
                      <IconButton color="error" size="small"><IconTrash size={18}/></IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3} className="no-print">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Medical Prescriptions Log</Typography>
                <Button variant="contained" color="primary" startIcon={<IconPlus />} onClick={() => navigate(`/linkdent/ordonnances?patient_id=${selectedPatient.id}`)}>
                  Create New Prescription
                </Button>
              </Box>
              {patientOrdonnancesList.length > 0 ? (
                <Grid container spacing={2}>
                  {patientOrdonnancesList.map((ord, idx) => (
                    <Grid item xs={12} md={6} key={ord.id || idx}>
                      <Box sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2, borderRight: '4px solid #10b981', bgcolor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h5" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconFileDescription size={20} /> Medical Prescription
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Date: {ord.date || 'Today'}</Typography>
                        <Typography variant="body1">Medications Prescribed: {(ord.medicationsList || []).length}</Typography>
                        <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/linkdent/ordonnances?patient_id=${selectedPatient.id}&edit=${ord.id}`)}>
                          View & Edit Prescription
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="body1" color="textSecondary">No prescriptions recorded for this patient.</Typography>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={4} className="no-print">
              {patientAppointments.length > 0 ? (
                <Grid container spacing={2}>
                  {patientAppointments.map(app => (
                    <Grid item xs={12} md={6} key={app.id}>
                      <Box sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2, borderRight: '4px solid #5e35b1', bgcolor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>{app.type}</Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconCalendarEvent size={18} /> Date: {app.date}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <IconClock size={18} /> Time: {app.time}
                        </Typography>
                        <Chip label={app.status} size="small" color={app.status === 'Confirmed' ? 'success' : 'warning'} sx={{ mt: 2, fontWeight: 'bold' }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="body1" color="textSecondary">No appointments currently booked in the agenda.</Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/dashboard/appointments')}>Go to Agenda to Book</Button>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={5} className="no-print">
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" color="primary">Invoices & Payments Log</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate(`/linkdent/odontogram?patient_id=${selectedPatient.id}`)}>
                  Create New Invoice (Devis)
                </Button>
              </Box>
              {patientInvoices.length > 0 ? (
                <Grid container spacing={2}>
                  {patientInvoices.map((invoice, idx) => (
                    <Grid item xs={12} md={6} key={invoice.id || idx}>
                      <Card sx={{ border: '1px solid #e2e8f0', borderRight: invoice.remaining === 0 ? '5px solid #10b981' : '5px solid #f59e0b', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Invoice #{invoice.id.toString().slice(-4)}</Typography>
                            <Typography variant="body2" color="textSecondary">{invoice.date}</Typography>
                          </Box>
                          
                          <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Total Treatment: <span style={{ color: '#0f172a' }}>{invoice.total} MAD</span></Typography>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Amount Paid: <span style={{ color: '#10b981' }}>{invoice.paid} MAD</span></Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Remaining (Debt): <span style={{ color: '#ef4444' }}>{invoice.remaining} MAD</span></Typography>
                          </Box>

                          <Button 
                              variant="outlined" 
                              fullWidth 
                              startIcon={<IconPrinter size={18} />}
                              onClick={() => alert(`You will be redirected to print invoice #${invoice.id}`)}
                          >
                              Print Invoice
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                  <IconReceipt size={48} color="#94a3b8" />
                  <Typography variant="h5" sx={{ mt: 2, color: '#64748b' }}>No financial invoices recorded for this patient.</Typography>
                </Box>
              )}
            </TabPanel>

          </MainCard>
        </Box>
      ) : (
        <MainCard title="Medical Records Management (CRM)">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            
            {/* 🔥 تم استرجاع زر Add New Column إلى مكانه الصحيح هنا 🔥 */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" color="secondary" onClick={handleColumnMenuClick} startIcon={<IconSettings size={18}/>}>
                Show / Hide Columns
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleColumnMenuClose}>
                <Box sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                  {columns.map((col) => (
                    <FormControlLabel key={col.id} control={<Checkbox checked={col.visible} onChange={() => toggleColumnVisibility(col.id)} />} label={col.label} sx={{ display: 'block' }} />
                  ))}
                </Box>
              </Menu>
              <Button variant="outlined" onClick={() => setIsAddColumnModalOpen(true)} startIcon={<IconPlus size={18}/>}>
                Add New Column
              </Button>
            </Box>

            <Button variant="contained" color="primary" onClick={() => {
                setModalMode('add');
                setNewPatient({});
                setIsPatientModalOpen(true);
            }} startIcon={<IconPlus />}>
              Open New Patient File
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ border: `1px solid ${theme.palette.divider}`, boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
                <TableRow>
                  {columns.filter(c => c.visible).map(col => (
                    <TableCell 
                      key={col.id} sx={{ fontWeight: 600, cursor: 'grab' }} draggable
                      onDragStart={(e) => handleDragStart(e, col.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><IconGripHorizontal size={14} color={theme.palette.grey[400]} />{col.label}</Box>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    {columns.filter(c => c.visible).map(col => (
                      <TableCell key={col.id}>{patient[col.id] || '-'}</TableCell>
                    ))}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button variant="contained" size="small" color="secondary" onClick={() => handleOpenProfile(patient)}>
                        View Full Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      )}

      {/* النوافذ المنبثقة */}
      <Dialog 
        open={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' } }}
      >
        <DialogTitle sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', px: 4, py: 3 }}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            {modalMode === 'add' ? <IconUser size={28}/> : <IconEdit size={28}/>}
            {modalMode === 'add' ? 'Open New Medical File' : 'Edit Patient Data'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontWeight: 500 }}>
            Ensure all patient information and insurance details are correctly filled for automated billing.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {columns.map((col) => {
              if (col.system) return null;
              
              if (col.type === 'insurance_selector') {
                return (
                  <Grid item xs={12} sm={6} key={col.id}>
                    <Box 
                      onClick={() => setIsInsuranceModalOpen(true)}
                      sx={{ 
                        bgcolor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '12px', p: 2, cursor: 'pointer', 
                        display: 'flex', flexDirection: 'column', gap: 1,
                        transition: 'all 0.2s', '&:hover': { borderColor: theme.palette.primary.main, bgcolor: '#f0f9ff', transform: 'translateY(-2px)' } 
                      }}
                    >
                      <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
                         <IconShieldCheck size={18}/> Insurance Provider (Mutuelle)
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: '800', color: newPatient[col.id] && newPatient[col.id] !== 'None' ? '#0f172a' : '#94a3b8' }}>
                        {newPatient[col.id] || 'Click to Select Insurance Provider'}
                      </Typography>
                    </Box>
                  </Grid>
                );
              }

              if (col.type === 'select') {
                return (
                  <Grid item xs={12} sm={6} key={col.id}>
                    <TextField select fullWidth label={col.label} value={newPatient[col.id] || ''} onChange={(e) => setNewPatient((prev) => ({ ...prev, [col.id]: e.target.value }))} sx={modalInputStyle}>
                      {col.options.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} sm={6} key={col.id}>
                  <TextField fullWidth label={col.label} value={newPatient[col.id] || ""} onChange={(e) => setNewPatient((prev) => ({ ...prev, [col.id]: e.target.value }))} sx={modalInputStyle} />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setIsPatientModalOpen(false)} sx={{ color: '#64748b', fontWeight: 'bold', px: 3 }}>Cancel</Button>
          <Button onClick={handleSavePatient} variant="contained" color="primary" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
            {modalMode === 'add' ? 'Save New Patient' : 'Update Patient Data'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isInsuranceModalOpen} onClose={() => setIsInsuranceModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: '#f8fafc' } }}>
        <DialogTitle sx={{ textAlign: 'center', p: 4, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
           <Typography variant="h3" sx={{ fontWeight: '900', color: '#0f172a' }}>Select Insurance Provider</Typography>
           <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Choose the mutuelle provider from the Moroccan network</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {MOROCCAN_INSURANCES.map(ins => (
              <Grid item xs={12} sm={4} key={ins.id}>
                <Card
                  onClick={() => {
                    setNewPatient({ ...newPatient, mutuelle: ins.name });
                    setIsInsuranceModalOpen(false);
                  }}
                  sx={{
                    cursor: 'pointer', borderRadius: 3,
                    border: `2px solid ${newPatient.mutuelle === ins.name ? ins.color : 'transparent'}`,
                    bgcolor: '#ffffff', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: newPatient.mutuelle === ins.name ? `0 10px 25px ${ins.color}30` : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 20px 25px -5px ${ins.color}20`, borderColor: ins.color }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: `${ins.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconShieldCheck size={32} color={ins.color} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: '800' }}>{ins.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
           <Button onClick={() => setIsInsuranceModalOpen(false)} sx={{ color: '#64748b', fontWeight: 'bold' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddColumnModalOpen} onClose={() => setIsAddColumnModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Custom Column</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>Once added, this column will appear as a new field when adding a patient.</Typography>
          <TextField fullWidth label="Column Name (e.g., Age, Blood Type)" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} autoFocus />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddColumnModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSaveNewColumn} variant="contained" color="primary">Add Column</Button>
        </DialogActions>
      </Dialog>

      <style>
        {`@media print { body * { visibility: hidden !important; background: white; } .no-print { display: none !important; } .no-print-border { border: none !important; box-shadow: none !important; } .print-odontogram-report, .print-odontogram-report * { visibility: visible !important; } .print-odontogram-report { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; } }`}
      </style>
    </Box>
  );
};

export default Patients;