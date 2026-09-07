import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const location = useLocation();

    // التحقق من وجود مفتاح الدخول في المتصفح
    const isAuthenticated = localStorage.getItem('linkdent_token'); 

    if (!isAuthenticated) {
        // إذا لم يكن مسجلاً، يتم توجيهه لصفحة الدخول مع حفظ الرابط الذي كان يحاول فتحه
        return <Navigate to="/pages/login" state={{ from: location }} replace />;
    }

    // إذا كان مسجلاً، يُسمح له بالدخول
    return children;
};

export default AuthGuard;