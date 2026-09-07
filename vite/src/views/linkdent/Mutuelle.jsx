import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, MenuItem, TextField, Card, CardContent, Divider, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip 
} from '@mui/material';
import { IconPrinter, IconShieldCheck, IconUser, IconStethoscope } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import { useAppContext } from '../../AppContext';

const Mutuelle = () => {
  const { clinicSettings } = useAppContext();
  const [patients, setPatients] = useState([]);
  const [odontograms, setOdontograms] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  useEffect(() => {
    const savedPatients = localStorage.getItem('linkdent_patients');
    if (savedPatients) setPatients(JSON.parse(savedPatients));
    
    const savedOdontograms = localStorage.getItem('linkdent_odontograms');
    if (savedOdontograms) setOdontograms(JSON.parse(savedOdontograms));
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientOdontogram = odontograms.find(o => String(o.patientId) === String(selectedPatientId));
  
  // حساب المجموع الكلي للعلاجات (أرقام افتراضية للتجربة)
  const calculateTotal = () => {
    if (!patientOdontogram || !patientOdontogram.logs) return 0;
    return patientOdontogram.logs.length * 400; // نفترض أن كل علاج بـ 400 درهم مؤقتاً
  };

  const totalAmount = calculateTotal();

  const handlePrint = () => {
    if (!selectedPatient) {
      alert("Please select a patient first.");
      return;
    }
    window.print();
  };

  const cardStyle = { bgcolor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', transition: 'all 0.2s', '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } };

  return (
    <Box>
      <Box className="no-print">
        <Typography variant="h2" sx={{ mb: 1, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconShieldCheck size={32} color="#3b82f6" />
          Health Insurance Management (Mutuelle)
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Generate, manage, and print official healthcare forms (CNSS, CNOPS, etc.) automatically.
        </Typography>

        <Grid container spacing={3}>
          {/* 🟢 قسم اختيار المريض 🟢 */}
          <Grid item xs={12} md={4}>
            <MainCard sx={{ ...cardStyle, height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconUser size={20} color="#64748b"/> Select Patient
              </Typography>
              <TextField 
                select 
                fullWidth 
                label="Search by File No. or Name" 
                value={selectedPatientId} 
                onChange={(e) => setSelectedPatientId(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {patients.filter(p => p.mutuelle && p.mutuelle !== 'None' && p.mutuelle !== 'No Insurance / Private').map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    File #{p.id} - {p.firstName} {p.lastName} ({p.mutuelle})
                  </MenuItem>
                ))}
              </TextField>

              {selectedPatient && (
                <Box sx={{ mt: 4, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="caption" color="textSecondary">Insurance Details</Typography>
                  <Typography variant="h5" sx={{ mt: 1, color: '#0f172a', fontWeight: 'bold' }}>{selectedPatient.mutuelle}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Matricule:</strong> {selectedPatient.matricule || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Relationship:</strong> {selectedPatient.kinship || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}><strong>CIN:</strong> {selectedPatient.cin || 'N/A'}</Typography>
                </Box>
              )}
            </MainCard>
          </Grid>

          {/* 🟢 قسم العلاجات والفواتير 🟢 */}
          <Grid item xs={12} md={8}>
            <MainCard sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconStethoscope size={20} color="#64748b"/> Treatments to Declare
                </Typography>
                <Typography variant="h3" color="primary">
                  Total: {totalAmount} MAD
                </Typography>
              </Box>

              {patientOdontogram && patientOdontogram.logs && patientOdontogram.logs.length > 0 ? (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, flexGrow: 1 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tooth</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Acte</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nomenclature (Code)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patientOdontogram.logs.map((log, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{log.date}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{log.tooth}</TableCell>
                          <TableCell>{log.acte}</TableCell>
                          <TableCell>
                            {/* ترجمة أوتوماتيكية للرموز */}
                            <Chip label={log.acteId === 'extracted' ? 'D30' : log.acteId === 'caries' ? 'D10' : 'D50'} size="small" color="primary" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, border: '1px dashed #cbd5e1', borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Typography color="textSecondary">{selectedPatient ? 'No treatments found in Odontogram.' : 'Select a patient to view treatments.'}</Typography>
                </Box>
              )}

              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  disabled={!selectedPatient}
                  sx={{ bgcolor: '#10b981', color: '#fff', px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { bgcolor: '#059669' } }} 
                  startIcon={<IconPrinter size={24} />} 
                  onClick={handlePrint}
                >
                  Print Official Form
                </Button>
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Box>

      {/* ========================================================= */}
      {/* 🔥 الجزء الخفي الذي يرسم الورقة الرسمية للطباعة بالكود 🔥 */}
      {/* ========================================================= */}
      {selectedPatient && (
        <Box className="print-form-container">
          <Box sx={{ border: '2px solid #000', width: '210mm', height: '290mm', p: 3, bgcolor: '#fff', boxSizing: 'border-box', position: 'relative' }}>
            
            {/* Header / Title */}
            <Box sx={{ textAlign: 'center', borderBottom: '3px solid #000', pb: 2, mb: 3 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '24px', textTransform: 'uppercase', fontFamily: 'serif' }}>
                Feuille de Soins - Soins Dentaires
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                {selectedPatient.mutuelle === 'CNSS / AMO' ? 'Caisse Nationale de Sécurité Sociale (AMO)' : selectedPatient.mutuelle}
              </Typography>
            </Box>

            {/* Block 1: Assuré (المؤمن له) */}
            <Box sx={{ border: '2px solid #000', mb: 2 }}>
              <Box sx={{ bgcolor: '#f0f0f0', p: 1, borderBottom: '2px solid #000' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>1. IDENTIFICATION DE L'ASSURÉ(E)</Typography>
              </Box>
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>Nom et Prénom:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</Typography>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>N° CIN:</strong> {selectedPatient.cin || '........................'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>N° d'immatriculation (Matricule):</strong></Typography>
                  <Box sx={{ border: '1px solid #000', p: 1, display: 'inline-block', minWidth: '200px', fontWeight: 'bold', fontSize: '16px', letterSpacing: '4px' }}>
                    {selectedPatient.matricule || 'N/A'}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Block 2: Praticien (الطبيب) */}
            <Box sx={{ border: '2px solid #000', mb: 2 }}>
              <Box sx={{ bgcolor: '#f0f0f0', p: 1, borderBottom: '2px solid #000' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>2. PARTIE RÉSERVÉE AU PRATICIEN TRAITANT</Typography>
              </Box>
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>Nom du médecin:</strong> {clinicSettings?.doctorName || ''}</Typography>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>Spécialité:</strong> {clinicSettings?.specialty || 'Chirurgien Dentiste'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>INPE:</strong> {clinicSettings?.inpe || '........................'}</Typography>
                  <Typography sx={{ fontSize: '14px', mb: 1 }}><strong>ICE:</strong> {clinicSettings?.ice || '........................'}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Block 3: Table des Actes (الجدول الطبي) */}
            <Box sx={{ border: '2px solid #000', mb: 2 }}>
              <Table size="small" sx={{ '& .MuiTableCell-root': { border: '1px solid #000', p: 1, fontSize: '12px' } }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date des soins</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>N° de la dent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Code Acte (Nomenclature)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Montant Honoraires</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientOdontogram && patientOdontogram.logs ? patientOdontogram.logs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell align="center"><strong>{log.tooth}</strong></TableCell>
                      <TableCell align="center"><strong>{log.acteId === 'extracted' ? 'D30' : log.acteId === 'caries' ? 'D10' : 'D50'}</strong></TableCell>
                      <TableCell align="right">400.00 MAD</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} align="center">Aucun acte enregistré</TableCell></TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>TOTAL FACTURÉ:</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>{totalAmount}.00 MAD</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            {/* Block 4: Signatures (الإمضاءات) */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Box sx={{ border: '2px solid #000', height: '150px', p: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>SIGNATURE ET CACHET DU MÉDECIN</Typography>
                  <Typography sx={{ fontSize: '12px', textAlign: 'center', mt: 1 }}>Fait à Tanger, le {new Date().toLocaleDateString('fr-FR')}</Typography>
                  {clinicSettings?.signature && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                       <img src={clinicSettings.signature} alt="Signature" style={{ maxHeight: '80px', maxWidth: '100%' }} />
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ border: '2px solid #000', height: '150px', p: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>SIGNATURE DE L'ASSURÉ(E)</Typography>
                </Box>
              </Grid>
            </Grid>

          </Box>
        </Box>
      )}

      {/* ستايلات الطباعة الصارمة لإظهار الورقة وإخفاء الموقع */}
      <style>{`
        .print-form-container { display: none; }
        @media print {
          @page { size: A4; margin: 0; }
          body { background-color: #fff !important; }
          body * { visibility: hidden !important; }
          .no-print { display: none !important; }
          
          .print-form-container, .print-form-container * {
            visibility: visible !important;
            color: #000 !important;
          }
          .print-form-container {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

    </Box>
  );
};

export default Mutuelle;