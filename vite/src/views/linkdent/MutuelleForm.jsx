import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { IconPrinter, IconArrowLeft } from '@tabler/icons-react';

const MutuelleForm = ({ patient, clinic, treatments, onBack }) => {
  
  // دالة الطباعة: تخفي كل شيء وتطبع الورقة فقط
  const handlePrint = () => {
    window.print();
  };

  // 🟢 هنا نضع إحداثيات النصوص (سجلت أرقاماً تقريبية سنعدلها لاحقاً لتتطابق مع الورقة الحقيقية 100%)
  const coordinates = {
    patientName: { top: '22.5%', left: '25%' },
    matricule: { top: '22.5%', left: '65%' },
    cin: { top: '26%', left: '25%' },
    kinship: { top: '26%', left: '65%' },
    
    doctorName: { top: '35%', left: '25%' },
    inpe: { top: '38%', left: '25%' },
    ice: { top: '41%', left: '25%' },
    
    totalAmount: { top: '85%', left: '75%' },
    date: { top: '88%', left: '25%' },
  };

  // ستايل النص المطبوع (خط عريض، لون أسود غامق ليكون واضحاً في الطباعة)
  const textStyle = {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000',
    fontFamily: 'monospace', // خط يشبه الآلة الكاتبة أو الطباعة الرسمية
    zIndex: 10,
  };

  // إذا لم يكن هناك مريض محدد
  if (!patient) return null;

  return (
    <Box sx={{ width: '100%', bgcolor: '#f1f5f9', minHeight: '100vh', pb: 5 }}>
      
      {/* 🔴 شريط التحكم (يختفي عند الطباعة) 🔴 */}
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, bgcolor: '#0f172a', color: '#fff', mb: 4 }}>
        <Button startIcon={<IconArrowLeft />} onClick={onBack} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          Back to Patient Profile
        </Button>
        <Typography variant="h4" sx={{ color: '#fbbf24', fontWeight: 'bold' }}>
          Generating Form: {patient.mutuelle || 'Insurance'}
        </Typography>
        <Button variant="contained" sx={{ bgcolor: '#fbbf24', color: '#0f172a', fontWeight: 'bold' }} startIcon={<IconPrinter />} onClick={handlePrint}>
          Print Form Now
        </Button>
      </Box>

      {/* 🟢 ورقة الطباعة A4 🟢 */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box 
          className="print-page"
          sx={{
            width: '210mm', 
            height: '297mm', 
            bgcolor: '#fff',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', // ظل فخم للشاشة فقط
            
            // 🔥 هنا سنضع رابط صورة الـ CNSS لاحقاً عندما تقوم بعمل Scan لها 🔥
            // backgroundImage: `url('/assets/cnss-blank-form.jpg')`, 
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            border: '1px solid #cbd5e1'
          }}
        >
          {/* رسالة مؤقتة لتوضح مكان الصورة (ستختفي لاحقاً) */}
          <Typography className="no-print" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cbd5e1', fontSize: '2rem', fontWeight: 'bold', opacity: 0.5, textAlign: 'center' }}>
            [ Background Image of {patient.mutuelle} Form Will Be Here ]
          </Typography>

          {/* === بيانات المريض === */}
          <Typography sx={{ ...textStyle, top: coordinates.patientName.top, left: coordinates.patientName.left }}>
            {patient.firstName} {patient.lastName}
          </Typography>
          <Typography sx={{ ...textStyle, top: coordinates.matricule.top, left: coordinates.matricule.left }}>
            {patient.matricule || 'N/A'}
          </Typography>
          <Typography sx={{ ...textStyle, top: coordinates.cin.top, left: coordinates.cin.left }}>
            {patient.cin || 'N/A'}
          </Typography>
          <Typography sx={{ ...textStyle, top: coordinates.kinship.top, left: coordinates.kinship.left }}>
            {patient.kinship || 'Insured'}
          </Typography>

          {/* === بيانات الطبيب === */}
          <Typography sx={{ ...textStyle, top: coordinates.doctorName.top, left: coordinates.doctorName.left }}>
            {clinic?.doctorName || 'Dr. John Doe'}
          </Typography>
          <Typography sx={{ ...textStyle, top: coordinates.inpe.top, left: coordinates.inpe.left }}>
            INPE: {clinic?.inpe || 'Not Configured'}
          </Typography>
          <Typography sx={{ ...textStyle, top: coordinates.ice.top, left: coordinates.ice.left }}>
            ICE: {clinic?.ice || 'Not Configured'}
          </Typography>

          {/* === بيانات الفاتورة والعلاجات (تجريبية) === */}
          <Typography sx={{ ...textStyle, top: coordinates.date.top, left: coordinates.date.left }}>
            {new Date().toLocaleDateString('en-GB')}
          </Typography>
          <Typography sx={{ ...textStyle, top: coordinates.totalAmount.top, left: coordinates.totalAmount.left }}>
            {treatments?.total || '0.00'} MAD
          </Typography>

        </Box>
      </Box>

      {/* 🔴 أوامر CSS صارمة لضمان طباعة الورقة فقط وإخفاء كل الموقع 🔴 */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body * { visibility: hidden !important; background-color: white !important; }
          .no-print { display: none !important; }
          
          /* إظهار ورقة A4 فقط ومحتوياتها */
          .print-page, .print-page * { 
            visibility: visible !important; 
            box-shadow: none !important;
            border: none !important;
          }
          
          /* ضبط الورقة في أعلى اليسار للطابعة */
          .print-page {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact !important; /* لضمان طباعة الألوان والخلفيات */
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default MutuelleForm;