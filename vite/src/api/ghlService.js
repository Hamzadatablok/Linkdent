// src/api/ghlService.js
import axios from 'axios';

// دالة سحب قائمة المرضى
export const fetchContactFromGHL = async () => {
    const locationId = sessionStorage.getItem('ghl_location_id');
    
    // تصحيح الرابط ليتطابق مع السيرفر: /api/contacts/:locationId
    const response = await axios.get(`https://linkdent.onrender.com/api/contacts/${locationId}`);
    return response.data;
};

// دالة تحديث بيانات المريض (ملاحظة: السيرفر يحتاج هذا المسار إذا كنت تريد تحديث مريض)
export const updateContactInGHL = async (formData) => {
    const locationId = sessionStorage.getItem('ghl_location_id');
    const contactId = sessionStorage.getItem('ghl_contact_id');

    // تأكد أنك ستضيف هذا المسار في index.js لاحقاً إذا لم يكن موجوداً
    const response = await axios.put(`https://linkdent.onrender.com/api/patient-info/${locationId}/${contactId}`, formData);
    return response.data;
};