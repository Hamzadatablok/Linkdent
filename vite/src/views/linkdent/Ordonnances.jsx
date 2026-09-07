import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { 
  Typography, Grid, TextField, Button, Box, Paper, MenuItem, IconButton, CircularProgress, Avatar, Stack
} from '@mui/material';
import { 
  IconPrinter, IconDeviceFloppy, IconPill, IconPlus, IconTrash, IconStethoscope, IconPrescription, IconClock, IconInfoCircle, IconArrowBackUp
} from '@tabler/icons-react';
import { useAppContext } from '../../AppContext'; // تأكد من المسار

const Ordonnances = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clinicSettings } = useAppContext(); // سحب معلومات الطبيب المحدثة
  
  const [clinicData, setClinicData] = useState(clinicSettings);
  const [contactsList, setContactsList] = useState([]);
  
  const [selectedContactId, setSelectedContactId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [medications, setMedications] = useState([
    { name: '', duration: '', instructions: '' }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const inputStyle = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(15, 23, 42, 0.8)', 
        color: '#ffffff',
        borderRadius: '12px',
        minHeight: '70px', 
        fontSize: '1.2rem', 
        fontWeight: 'bold',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.15)', borderWidth: '1.5px' },
        '&:hover fieldset': { borderColor: '#3b82f6' },
        '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': { color: '#94a3b8', fontSize: '1.2rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
    '& .MuiSelect-icon': { color: '#94a3b8', fontSize: '2.5rem', right: '15px' } 
  };

  useEffect(() => {
    // التحديث الحي لبيانات العيادة من الإعدادات
    if(clinicSettings) setClinicData(clinicSettings);

    const fetchContacts = async () => {
      try {
        const localPatients = JSON.parse(localStorage.getItem('linkdent_patients')) || [];
        const combinedContacts = localPatients.map(p => ({ id: String(p.id), fullName: `${p.firstName} ${p.lastName}` }));
        setContactsList(combinedContacts);

        const editId = searchParams.get('edit');
        if (editId) {
            const savedOrds = JSON.parse(localStorage.getItem('linkdent_ordonnances')) || [];
            const toEdit = savedOrds.find(o => String(o.id) === String(editId));
            if (toEdit) {
                if (toEdit.medicationsList) setMedications(toEdit.medicationsList);
                if (toEdit.date) {
                    const [day, month, year] = toEdit.date.split('/');
                    if (year && month && day) setPrescriptionDate(`${year}-${month}-${day}`);
                } 
                const foundPatient = combinedContacts.find(c => String(c.id) === String(toEdit.patientId));
                if (foundPatient) { setSelectedContactId(foundPatient.id); setPatientName(foundPatient.fullName); }
                setIsViewMode(true); 
            }
        } else {
            const pId = searchParams.get('patient_id');
            if (pId) {
                const found = combinedContacts.find(c => String(c.id) === String(pId));
                if (found) { setSelectedContactId(found.id); setPatientName(found.fullName); }
            }
        }
      } catch (err) {} finally { setLoading(false); }
    };

    fetchContacts();
  }, [searchParams, clinicSettings]);

  const handleSelectPatient = (e) => {
    const contactId = e.target.value;
    setSelectedContactId(contactId);
    if (contactId) {
      const contact = contactsList.find(c => String(c.id) === String(contactId));
      if (contact) setPatientName(contact.fullName);
    } else { setPatientName(''); }
  };

  const addMedication = () => setMedications([...medications, { name: '', duration: '', instructions: '' }]);
  const removeMedication = (index) => setMedications(medications.filter((_, i) => i !== index));
  const updateMedication = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  const handlePrint = () => {
    setIsPrinting(true); 
    setTimeout(() => {
        window.print(); 
        setIsPrinting(false); 
    }, 300);
  };

  const handleSaveToCRM = () => {
    if (!selectedContactId) { alert("⚠️ Please select a patient."); return; }
    const validMeds = medications.filter(m => m.name.trim() !== '');
    if (validMeds.length === 0) { alert("⚠️ Please enter at least one medication."); return; }
    
    setIsSaving(true);
    try {
        const savedOrds = JSON.parse(localStorage.getItem('linkdent_ordonnances')) || [];
        const dateObj = new Date(prescriptionDate);
        savedOrds.push({
            id: Date.now().toString(), 
            patientId: String(selectedContactId),
            date: dateObj.toLocaleDateString('fr-FR'), 
            medicationsList: validMeds
        });
        localStorage.setItem('linkdent_ordonnances', JSON.stringify(savedOrds));
        setTimeout(() => { 
            setIsSaving(false);
            alert("✅ Prescription saved successfully!"); 
            navigate('/dashboard/patients'); 
        }, 1000);
    } catch (err) { setIsSaving(false); alert("❌ Error saving prescription."); }
  };

  const PrescriptionPaper = () => (
    <div id="printable-prescription" style={{ 
        width: '100%', 
        maxWidth: isPrinting ? '100%' : '900px', 
        minHeight: isPrinting ? 'auto' : '800px', 
        backgroundColor: '#FEFEFE', 
        color: '#010101', 
        padding: '40px', 
        margin: 'auto', 
        borderRadius: isPrinting ? '0' : '12px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '3px solid #010101', paddingBottom: '15px' }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '2.2rem', textTransform: 'uppercase', fontWeight: 900 }}>{clinicData.doctorName}</h2>
                <h4 style={{ margin: '8px 0', fontSize: '1.2rem', color: '#333' }}>{clinicData.specialty || 'Dental Surgeon'}</h4>
                <p style={{ margin: 0, fontWeight: 600 }}>{clinicData.clinicName}</p>
            </div>
            {clinicData.logo && <img src={clinicData.logo} alt="Logo" style={{ maxHeight: '80px', maxWidth: '140px', objectFit: 'contain' }} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', border: '2px solid #010101', borderRadius: '8px', marginBottom: '40px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Patient: <span style={{ fontWeight: 500 }}>{patientName || '________________________'}</span></h3>
            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Date: <span style={{ fontWeight: 500 }}>{new Date(prescriptionDate).toLocaleDateString('en-GB')}</span></h3>
        </div>

        <h1 style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '4rem', margin: '0 0 30px 0' }}>Rx.</h1>

        <div style={{ flexGrow: 1, paddingLeft: '20px' }}>
            {medications.map((med, index) => (med.name || med.duration || med.instructions) ? (
                <div key={index} style={{ marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.5rem' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#010101', borderRadius: '50%', display: 'inline-block' }}></span>
                        {med.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '35px', paddingLeft: '25px' }}>
                        {med.duration && <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', color: '#222' }}><IconClock size={22} color="#010101" /> {med.duration}</h4>}
                        {med.instructions && <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', color: '#222' }}><IconInfoCircle size={22} color="#010101" /> {med.instructions}</h4>}
                    </div>
                </div>
            ) : null)}
        </div>

        <div style={{ borderTop: '3px solid #010101', paddingTop: '15px', marginTop: 'auto', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{clinicData.address}</h4>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Tel: {clinicData.phone}</p>
        </div>
    </div>
  );

  const GlobalShieldStyle = () => (
    <style>{`
        .MuiListItemButton-root.Mui-selected {
            background-color: #ffffff !important;
            border-radius: 8px !important;
            margin: 4px 8px !important;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2) !important;
        }
        .MuiListItemButton-root.Mui-selected *,
        .MuiListItemButton-root.Mui-selected .MuiTypography-root,
        .MuiListItemButton-root.Mui-selected svg {
            color: #0f172a !important;
            fill: #0f172a !important;
            font-weight: 900 !important;
        }
        @media print {
            @page { size: A4 portrait; margin: 0; }
            body, html { background: #FEFEFE !important; padding: 0 !important; margin: 0 !important; height: 100% !important; overflow: hidden !important; }
            header, nav, aside, .MuiDrawer-root, .MuiAppBar-root, .no-print { display: none !important; }
            #printable-prescription { 
                display: flex !important; position: absolute !important; left: 0 !important; top: 0 !important;
                width: 100vw !important; min-height: 100vh !important; margin: 0 !important; padding: 40px !important; 
                box-sizing: border-box !important; background-color: #FEFEFE !important;
                -webkit-print-color-adjust: exact !important; color-adjust: exact !important; 
                box-shadow: none !important; border: none !important; z-index: 9999 !important;
            }
            #printable-prescription * { background-color: transparent !important; color: #010101 !important; border-color: #010101 !important; }
        }
    `}</style>
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress color="primary" size={60} /></Box>;
  if (!clinicData) return null;

  if (isPrinting) {
      return (
          <Box sx={{ width: '100%', height: '100vh', backgroundColor: '#fff', m: 0, p: 0, overflow: 'hidden' }}>
              <GlobalShieldStyle />
              <PrescriptionPaper />
          </Box>
      );
  }

  if (isViewMode) {
      return (
          <MainCard title="Prescription Viewer" sx={{ backgroundColor: 'transparent', border: 'none', p: 0 }}>
              <GlobalShieldStyle />
              <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
                  <Button onClick={handlePrint} variant="contained" size="large" startIcon={<IconPrinter size={28} />} sx={{ py: 2, px: 5, fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#2563eb', borderRadius: 3, '&:hover': { backgroundColor: '#1d4ed8' } }}>Print PDF</Button>
                  <Button onClick={() => navigate(-1)} variant="outlined" size="large" startIcon={<IconArrowBackUp size={28} />} sx={{ py: 2, px: 5, fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 3, '&:hover': { borderColor: '#fff' } }}>Back to Patient</Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PrescriptionPaper />
              </Box>
          </MainCard>
      );
  }

  return (
    <MainCard title="Create Medical Prescription" sx={{ width: '100%', backgroundColor: 'transparent', border: 'none', p: 0 }}>
      <GlobalShieldStyle />
      <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
        <Grid item xs={12} lg={7} xl={7} className="no-print" sx={{ p: '0 !important', pr: { lg: 4 } }}>
          <Paper elevation={0} sx={{ p: {xs: 3, md: 5}, mb: 4, width: '100%', backgroundColor: '#0f172a', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: 64, height: 64 }}><IconStethoscope size={36} /></Avatar>
              <Typography variant="h2" sx={{ fontWeight: '900', color: '#fff' }}>Patient Information</Typography>
            </Box>
            <Stack spacing={4} sx={{ width: '100%' }}>
              <TextField select fullWidth label="Select Patient from Records" value={selectedContactId} onChange={handleSelectPatient} variant="outlined" sx={inputStyle}>
                <MenuItem value="" disabled><em>-- Select Patient --</em></MenuItem>
                {contactsList.map(contact => (
                    <MenuItem key={contact.id} value={contact.id} sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold' }}>{contact.fullName}</MenuItem>
                ))}
              </TextField>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}><TextField fullWidth label="Manual Name Input (Optional)" value={patientName} onChange={(e) => setPatientName(e.target.value)} sx={inputStyle} /></Grid>
                <Grid item xs={12} md={5}><TextField fullWidth type="date" label="Prescription Date" value={prescriptionDate} onChange={(e) => setPrescriptionDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputStyle} /></Grid>
              </Grid>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: {xs: 3, md: 5}, mb: 5, width: '100%', backgroundColor: '#0f172a', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
              <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 64, height: 64 }}><IconPill size={36} /></Avatar>
              <Typography variant="h2" sx={{ fontWeight: '900', color: '#fff' }}>Prescribed Medications</Typography>
            </Box>
            {medications.map((med, index) => (
              <Box key={index} sx={{ mb: 4, p: 4, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: -16, left: 24, bgcolor: '#3b82f6', color: '#fff', px: 3, py: 1, borderRadius: 2, fontWeight: '900', fontSize: '1.1rem' }}>Rx #{index + 1}</Box>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={5}><TextField fullWidth label="Medication Name" value={med.name} onChange={(e) => updateMedication(index, 'name', e.target.value)} sx={inputStyle} /></Grid>
                  <Grid item xs={12} md={2}><TextField fullWidth label="Duration" value={med.duration} onChange={(e) => updateMedication(index, 'duration', e.target.value)} sx={inputStyle} /></Grid>
                  <Grid item xs={12} md={5}><TextField fullWidth label="Instructions" value={med.instructions} onChange={(e) => updateMedication(index, 'instructions', e.target.value)} sx={inputStyle} /></Grid>
                </Grid>
                {medications.length > 1 && (
                  <IconButton onClick={() => removeMedication(index)} sx={{ position: 'absolute', top: 15, right: 15, color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' }}><IconTrash size={28} /></IconButton>
                )}
              </Box>
            ))}
            <Button onClick={addMedication} variant="outlined" startIcon={<IconPlus size={28} />} sx={{ mt: 2, py: 2.5, px: 5, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 3, color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.5)' }}>Add Another Medication</Button>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, mb: { xs: 5, lg: 0 } }}>
            <Button fullWidth onClick={handlePrint} variant="contained" size="large" startIcon={<IconPrinter size={32} />} sx={{ py: 3, fontSize: '1.4rem', fontWeight: 'bold', color: '#ffffff !important', backgroundColor: '#2563eb', borderRadius: 3, '&:hover': { backgroundColor: '#1d4ed8' } }}>Print Prescription</Button>
            <Button fullWidth onClick={handleSaveToCRM} disabled={isSaving} variant="contained" size="large" startIcon={isSaving ? <CircularProgress size={32} color="inherit" /> : <IconDeviceFloppy size={32} />} sx={{ py: 3, fontSize: '1.4rem', fontWeight: 'bold', color: '#ffffff !important', backgroundColor: '#059669', borderRadius: 3, '&:hover': { backgroundColor: '#047857' } }}>
              {isSaving ? 'Saving...' : 'Save to Patient File'}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} lg={5} xl={5} sx={{ p: '0 !important' }}>
          <Box sx={{ position: 'sticky', top: 24, width: '100%' }}>
            <Typography variant="h4" sx={{ color: '#94a3b8', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }} className="no-print"><IconPrescription size={28} /> Live Preview (A4 Format)</Typography>
            <PrescriptionPaper />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Ordonnances;