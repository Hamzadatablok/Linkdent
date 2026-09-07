import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, TextField, Select, MenuItem } from '@mui/material';
import { IconInfoCircle, IconLogout, IconLogin, IconUpload, IconTrash } from '@tabler/icons-react';
import { useAppContext } from '../../AppContext'; 
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { clinicSettings, updateClinicSettings, logoutUser, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(clinicSettings);

  useEffect(() => {
    if(clinicSettings) setFormData(clinicSettings);
  }, [clinicSettings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (field) => {
    setFormData({ ...formData, [field]: null });
  };

  const handleUpdate = () => {
    updateClinicSettings(formData);
    alert('✅ Clinic settings updated successfully! Changes will reflect on Prescriptions and Certificates.');
  };

  const labelStyle = { fontWeight: 600, fontSize: '0.85rem', mb: 0.8, color: '#333', display: 'flex', alignItems: 'center', gap: '4px' };
  const inputStyle = { mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '4px', bgcolor: '#fff' } };
  const cardStyle = { p: 4, bgcolor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', width: '100%' };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', m: 0, p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Manage General Information and Clinic Settings
        </Typography>
        
        {currentUser ? (
          <Button variant="outlined" color="error" startIcon={<IconLogout />} onClick={logoutUser}>
            Sign Out
          </Button>
        ) : (
          <Button variant="contained" color="primary" startIcon={<IconLogin />} onClick={() => navigate('/pages/login')}>
            Sign In
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        
        <Grid item xs={12} md={6} sx={{ pl: { xs: 0, md: '0 !important' }, pr: { xs: 0, md: 1.5 } }}>
          <Box sx={cardStyle}>
            <Typography variant="h4" sx={{ fontWeight: 500, mb: 4 }}>General Information</Typography>

            {/* Business Logo Upload */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Box sx={{ width: 150, height: 100, bgcolor: '#f1f5f9', borderRadius: '4px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {formData?.logo ? <img src={formData.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <Typography variant="caption" color="textSecondary">No Logo</Typography>}
              </Box>
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Business Logo</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                  Recommended size: 350px * 180px. Max size 2.5 MB
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component="label" variant="outlined" size="small" startIcon={<IconUpload size={16}/>} sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#0f172a' }}>
                    Upload <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<IconTrash size={16}/>} onClick={() => handleRemoveImage('logo')} sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#ef4444' }}>Remove</Button>
                </Box>
              </Box>
            </Box>

            {/* Signature Upload */}
            <Box sx={{ display: 'flex', gap: 2, mb: 5 }}>
              <Box sx={{ width: 150, height: 80, bgcolor: '#f1f5f9', borderRadius: '4px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {formData?.signature ? <img src={formData.signature} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <Typography variant="caption" color="textSecondary">No Signature</Typography>}
              </Box>
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Electronic Signature</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                  Automatically included at the bottom of prescriptions and certificates
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component="label" variant="outlined" size="small" startIcon={<IconUpload size={16}/>} sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#0f172a' }}>
                    Upload <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'signature')} />
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<IconTrash size={16}/>} onClick={() => handleRemoveImage('signature')} sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#ef4444' }}>Remove</Button>
                </Box>
              </Box>
            </Box>

            <Typography sx={labelStyle}>Clinic Name</Typography>
            <TextField fullWidth size="small" name="clinicName" value={formData?.clinicName || ''} onChange={handleChange} sx={inputStyle} />

            <Typography sx={labelStyle}>Doctor's Full Name <IconInfoCircle size={14} color="#94a3b8"/></Typography>
            <TextField fullWidth size="small" name="doctorName" value={formData?.doctorName || ''} onChange={handleChange} placeholder="Official Name" sx={{ mb: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '4px', bgcolor: '#fff' } }} />
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2.5 }}>
              The name used for printing official documents
            </Typography>

            <Typography sx={labelStyle}>Specialty</Typography>
            <TextField fullWidth size="small" name="specialty" value={formData?.specialty || ''} onChange={handleChange} sx={inputStyle} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={labelStyle}>Clinic Email</Typography>
                <TextField fullWidth size="small" name="email" value={formData?.email || ''} onChange={handleChange} placeholder="Business Email" sx={inputStyle} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={labelStyle}>Phone Number</Typography>
                <TextField fullWidth size="small" name="phone" value={formData?.phone || ''} onChange={handleChange} sx={inputStyle} />
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ textTransform: 'none', px: 4, py: 1, bgcolor: '#1d4ed8' }}>
                Update Information
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ pr: { xs: 0, md: '0 !important' }, pl: { xs: 0, md: 1.5 } }}>
          <Box sx={cardStyle}>
            <Typography variant="h4" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              Geographical Address <IconInfoCircle size={18} color="#94a3b8" />
            </Typography>

            <Typography sx={labelStyle}>Full Address <IconInfoCircle size={14} color="#94a3b8"/></Typography>
            <TextField fullWidth size="small" name="address" value={formData?.address || ''} onChange={handleChange} sx={inputStyle} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Typography sx={labelStyle}>City</Typography>
                <TextField fullWidth size="small" defaultValue="Tangier" sx={inputStyle} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography sx={labelStyle}>ZIP Code</Typography>
                <TextField fullWidth size="small" defaultValue="90100" sx={inputStyle} />
              </Grid>
            </Grid>

            <Typography sx={labelStyle}>State / Province</Typography>
            <TextField fullWidth size="small" defaultValue="Tangier-Tétouan-Al Hoceima" sx={inputStyle} />

            <Typography sx={labelStyle}>Country</Typography>
            <Select fullWidth size="small" defaultValue="Morocco" sx={inputStyle}>
              <MenuItem value="Morocco">Morocco</MenuItem>
            </Select>
            
            <Box sx={{ textAlign: 'right', mt: 4 }}>
              <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ textTransform: 'none', px: 4, py: 1, bgcolor: '#1d4ed8' }}>
                Update Address
              </Button>
            </Box>
          </Box>

          {/* 🔥 القسم الجديد: المعلومات القانونية للتأمين 🔥 */}
          <Box sx={{ ...cardStyle, mt: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              Legal & Medical IDs (Morocco) <IconInfoCircle size={18} color="#94a3b8" />
            </Typography>

            <Typography sx={labelStyle}>INPE (رقم الاستدلال الوطني المهني)</Typography>
            <TextField fullWidth size="small" name="inpe" value={formData?.inpe || ''} onChange={handleChange} sx={inputStyle} placeholder="Required for AMO / Mutuelle" />

            <Typography sx={labelStyle}>ICE (التعريف الموحد للمقاولة)</Typography>
            <TextField fullWidth size="small" name="ice" value={formData?.ice || ''} onChange={handleChange} sx={inputStyle} />

            <Typography sx={labelStyle}>Tax ID (التعريف الضريبي - IF)</Typography>
            <TextField fullWidth size="small" name="taxId" value={formData?.taxId || ''} onChange={handleChange} sx={inputStyle} />
            
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button onClick={handleUpdate} variant="contained" color="secondary" sx={{ textTransform: 'none', px: 4, py: 1 }}>
                Save IDs
              </Button>
            </Box>
          </Box>

        </Grid>

      </Grid>
    </Box>
  );
};

export default Settings;