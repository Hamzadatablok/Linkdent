// src/api/ghl.js
import axios from 'axios';

const getLocationId = () => sessionStorage.getItem('ghl_location_id');

export const getContactDetails = async () => {
    const locationId = getLocationId();
    const contactId = sessionStorage.getItem('ghl_contact_id');

    if (!locationId || !contactId) return null;

    try {
        // تصحيح الرابط ليتطابق مع المسار رقم 5 في السيرفر: /api/patient-info/:locationId/:contactId
        const response = await axios.get(`https://linkdent.onrender.com/api/patient-info/${locationId}/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("فشل جلب بيانات العميل من GHL:", error);
        return null;
    }
};