import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { 
    Typography, Grid, TextField, Button, Box, Paper, Divider, MenuItem, CircularProgress 
} from '@mui/material';
import { 
    IconPrinter, IconDeviceFloppy, IconCertificate
} from '@tabler/icons-react';
import { useAppContext } from '../../AppContext';

const Certificats = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const { clinicSettings } = useAppContext();
    
    const [clinicData, setClinicData] = useState(clinicSettings);
    const [contactsList, setContactsList] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [patientName, setPatientName] = useState('');
    const [cin, setCin] = useState('');
    const [restDays, setRestDays] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if(clinicSettings) setClinicData(clinicSettings);

        const fetchContacts = async () => {
            try {
                const localPatients = JSON.parse(localStorage.getItem('linkdent_patients')) || [];
                const combinedContacts = localPatients.map(p => ({
                    id: p.id,
                    fullName: `${p.firstName} ${p.lastName}`,
                    cin: p.cin
                }));
                
                setContactsList(combinedContacts);

                const pId = searchParams.get('patient_id');
                if (pId) {
                    const found = combinedContacts.find(c => String(c.id) === String(pId));
                    if (found) {
                        setSelectedContactId(found.id);
                        setPatientName(found.fullName);
                        if (found.cin) setCin(found.cin);
                    }
                }
            } catch (err) {
                console.error('Error fetching contacts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [searchParams, clinicSettings]);

    const handleSelectPatient = (e) => {
        const contactId = e.target.value;
        setSelectedContactId(contactId);
        if (contactId) {
            const contact = contactsList.find(c => c.id === contactId);
            if (contact) {
                setPatientName(contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim());
                if (contact.cin) setCin(contact.cin);
            }
        } else {
            setPatientName('');
            setCin('');
        }
    };

    const handlePrint = () => window.print();

    const handleSaveToCRM = () => {
        if (!selectedContactId) {
            alert("⚠️ Please select a patient from the list.");
            return;
        }
        if (!restDays) {
            alert("⚠️ Please enter the number of rest days.");
            return;
        }

        setIsSaving(true);
        try {
            const savedCerts = JSON.parse(localStorage.getItem('linkdent_certificates')) || [];
            savedCerts.push({ id: Date.now(), patientId: selectedContactId, date: startDate, restDays, reason });
            localStorage.setItem('linkdent_certificates', JSON.stringify(savedCerts));

            alert("✅ Certificate saved successfully to patient records!");
        } catch (err) {
            alert("❌ An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (!clinicData) return null;

    return (
        <MainCard title="Issue Medical Certificate" sx={{ backgroundColor: 'transparent', border: 'none', '@media print': { border: 'none', m: 0, p: 0, boxShadow: 'none' } }}>
            
            <Paper className="no-print" elevation={0} sx={{ mb: 5, p: 4, backgroundColor: '#0f172a', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <IconCertificate color="#8b5cf6" size={28} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>Certificate Information</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField select fullWidth label="Select Patient from Records" value={selectedContactId} onChange={handleSelectPatient} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}>
                            <MenuItem value=""><em>-- Select from Records --</em></MenuItem>
                            {contactsList.map(contact => {
                                const name = contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
                                return <MenuItem key={contact.id} value={contact.id}>{name}</MenuItem>;
                            })}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Full Name" variant="outlined" value={patientName} onChange={(e) => setPatientName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="National ID Number (CIN)" variant="outlined" value={cin} onChange={(e) => setCin(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Number of Rest Days" variant="outlined" type="number" value={restDays} onChange={(e) => setRestDays(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Start Date" variant="outlined" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows={3} label="Reason or Notes" variant="outlined" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Dental Surgery..." sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }} />
                    </Grid>
                </Grid>
            </Paper>

            <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 5 }}>
                <Button variant="contained" color="secondary" size="large" startIcon={<IconPrinter size={22} />} onClick={handlePrint} sx={{ px: 5, py: 1.5, borderRadius: 2 }}>Print Certificate</Button>
                <Button variant="outlined" color="primary" size="large" startIcon={isSaving ? <CircularProgress size={20} /> : <IconDeviceFloppy size={22} />} onClick={handleSaveToCRM} disabled={isSaving} sx={{ px: 4, py: 1.5, borderRadius: 2 }}>{isSaving ? 'Saving...' : 'Save to Records'}</Button>
            </Box>

            <Box className="print-certificate-container" sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#020617', py: 4, borderRadius: 3 }}>
                <Paper className="print-certificate" elevation={6} sx={{ p: 6, width: '100%', maxWidth: '800px', backgroundColor: '#ffffff !important', color: '#000000 !important', position: 'relative' }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #673ab7', pb: 2, mb: 4 }}>
                            <Box sx={{ textAlign: 'left', color: '#000' }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#000' }}>{clinicData.doctorName}</Typography>
                                <Typography variant="body2" sx={{ color: '#333' }}>{clinicData.clinicName}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: 'center', mb: 4, color: '#000' }}>
                            <Typography variant="h3" sx={{ textTransform: 'uppercase', letterSpacing: 2, color: '#000' }}>Medical Certificate</Typography>
                            <Typography variant="h5" sx={{ color: '#333' }}>Certificat Médical</Typography>
                        </Box>

                        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 2, mb: 4, textAlign: 'left', color: '#000' }}>
                            I, the undersigned, Doctor of Dental Medicine, certify having examined today:<br />
                            <strong>Mr / Mrs:</strong> {patientName}<br />
                            <strong>CIN Holder:</strong> {cin}<br />
                            And that his/her health condition requires a rest of <strong>{restDays}</strong> days, starting from {startDate}.
                        </Typography>

                        {reason && (
                            <Box sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #ddd', mb: 4, color: '#000' }}>
                                <Typography variant="body2" sx={{ color: '#000' }}><strong>Motif / Reason:</strong> {reason}</Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, color: '#000' }}>
                            <Typography sx={{ color: '#000' }}>Done at {clinicData.address ? clinicData.address.split(',')[0] : 'Tangier'}, on : {new Date().toLocaleDateString('en-GB')}</Typography>
                            <Box sx={{ width: '150px', height: '100px', border: '1px dashed #ccc' }} />
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 10mm; }
                    body, body * { visibility: hidden; }
                    .print-certificate, .print-certificate * { visibility: visible; }
                    .no-print { display: none !important; }
                    .print-certificate {
                        position: absolute; left: 0; top: 0; width: 100%; height: auto;
                        padding: 0 !important; margin: 0 !important; box-shadow: none !important;
                        background: #ffffff !important; color: #000000 !important;
                    }
                    .print-certificate-container { background: #ffffff !important; }
                }
            `}</style>
        </MainCard>
    );
};

export default Certificats;