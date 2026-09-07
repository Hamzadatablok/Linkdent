import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const [clinicSettings, setClinicSettings] = useState({
        doctorName: "DR. JOHN DOE",
        clinicName: "Linkdent Premium Care",
        specialty: "Dental Surgeon",
        address: "123 Premium Street, Tangier, Morocco",
        phone: "+212 600 000 000",
        email: "contact@linkdent.com",
        logo: null,
        signature: null,
        clinicId: "LD-DEFAULT"
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoadingAuth(false);
        });

        const savedSettings = localStorage.getItem('linkdent_clinic_settings');
        if (savedSettings) {
            setClinicSettings(JSON.parse(savedSettings));
        }

        return unsubscribe;
    }, []);

    const updateClinicSettings = (newSettings) => {
        setClinicSettings(newSettings);
        localStorage.setItem('linkdent_clinic_settings', JSON.stringify(newSettings));
    };

    const logoutUser = async () => {
        try {
            await signOut(auth);
            
            const keysToRemove = [
                'linkdent_token', 'linkdent_clinic_settings', 'linkdent_patients',
                'linkdent_appointments', 'linkdent_odontograms', 'linkdent_ordonnances',
                'linkdent_certificates', 'linkdent_invoices', 'linkdent_prices',
                'linkdent_is_impersonating' // مسح أثر التخفي عند الخروج
            ];
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            window.location.href = '/pages/login'; 
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // إنهاء وضع التخفي والعودة كآدمن
    const stopImpersonating = () => {
        localStorage.removeItem('linkdent_is_impersonating');
        window.location.href = '/admin/dashboard';
    };

    const adminReturnBtnStyle = {
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        backgroundColor: '#fbbf24',
        color: '#0f172a',
        padding: '12px 24px',
        borderRadius: '50px',
        fontWeight: '900',
        boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
        cursor: 'pointer',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '2px solid #fff',
        fontSize: '1.1rem',
        transition: 'transform 0.2s',
    };

    // الزر يظهر فقط إذا كان مفتاح التخفي مفعلاً
    const isImpersonating = localStorage.getItem('linkdent_is_impersonating') === 'true';

    return (
        <AppContext.Provider value={{ currentUser, loadingAuth, clinicSettings, updateClinicSettings, logoutUser }}>
            {!loadingAuth && children}
            
            {isImpersonating && (
                <button 
                    onClick={stopImpersonating} 
                    style={adminReturnBtnStyle}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    👑 Return to Admin Center
                </button>
            )}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);