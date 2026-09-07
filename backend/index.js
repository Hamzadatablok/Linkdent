require('dotenv').config();

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// ====================================================
// 1. الاتصال بقاعدة البيانات
// ====================================================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('DB Error:', err));


// ====================================================
// 2. النماذج القديمة
// ====================================================

// ----------------------------------------------------
// Token
// ----------------------------------------------------

const TokenSchema = new mongoose.Schema({
    locationId: String,
    access_token: String,
    refresh_token: String
});

const Token = mongoose.model('Token', TokenSchema);


// ----------------------------------------------------
// Clinic
// ----------------------------------------------------

const ClinicSchema = new mongoose.Schema({
    slug: String,
    doctorName: String,
    clinicName: String,
    locationId: String,
    logo: String,
    phone: String,
    address: String
});

const Clinic = mongoose.model('Clinic', ClinicSchema);


// ----------------------------------------------------
// Expense
// ----------------------------------------------------

const ExpenseSchema = new mongoose.Schema({
    locationId: String,
    title: String,
    amount: Number,
    category: String,
    date: String,
    hasAttachment: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', ExpenseSchema);


// ====================================================
// 3. النماذج الجديدة - النظام المستقل CRM
// ====================================================

// ----------------------------------------------------
// User / Doctor
// ----------------------------------------------------

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    doctorName: {
        type: String,
        default: 'د. طبيب الأسنان'
    },

    clinicName: {
        type: String,
        default: 'عيادة الأسنان'
    },

    phone: {
        type: String,
        default: ''
    },

    address: {
        type: String,
        default: ''
    },

    logoUrl: {
        type: String,
        default: ''
    },

    signatureUrl: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);


// ----------------------------------------------------
// Patient
// ----------------------------------------------------

const PatientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ''
    },

    cin: {
        type: String,
        default: ''
    },

    birthDate: {
        type: String,
        default: ''
    },

    medicalHistory: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Patient = mongoose.model('Patient', PatientSchema);


// ====================================================
// 4. Odontogram
// ====================================================
//
// كل Patient لديه Odontogram خاص به.
// كل Odontogram مرتبط أيضًا بـ userId.
// هذا يمنع اختلاط بيانات المرضى بين العيادات.
// ====================================================

const OdontogramSchema = new mongoose.Schema({

    // الطبيب / الحساب صاحب البيانات
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // معرف المريض
    patientId: {
        type: String,
        required: true,
        index: true
    },

    // حالة جميع الأسنان
    //
    // مثال:
    // {
    //   "18": "healthy",
    //   "17": "caries",
    //   "16": "filling"
    // }
    teethState: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // العمليات / الأحداث الحالية
    logs: {
        type: Array,
        default: []
    },

    // السجلات المؤرشفة
    archivedLogs: {
        type: Array,
        default: []
    },

    // الأسنان التي تمت معالجتها
    treatedTeeth: {
        type: Array,
        default: []
    },

    // آخر تحديث
    lastUpdated: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// منع إنشاء أكثر من Odontogram لنفس المريض
// داخل نفس حساب الطبيب.
OdontogramSchema.index(
    {
        userId: 1,
        patientId: 1
    },
    {
        unique: true
    }
);

const Odontogram = mongoose.model(
    'Odontogram',
    OdontogramSchema
);


// ====================================================
// 5. Authentication Middleware
// ====================================================

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'غير مصرح بالدخول'
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET ||
            'linkdent_super_secret_key_2026',
        (err, user) => {

            if (err) {
                return res.status(403).json({
                    error: 'الجلسة منتهية'
                });
            }

            req.user = user;

            next();
        }
    );
};


// ====================================================
// 6. AUTH - REGISTER
// ====================================================

app.post('/api/auth/register', async (req, res) => {

    try {

        const {
            email,
            password,
            doctorName,
            clinicName
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                error: 'البريد الإلكتروني وكلمة المرور مطلوبان'
            });
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                error: 'البريد الإلكتروني مسجل مسبقاً'
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            doctorName,
            clinicName
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح'
        });

    } catch (err) {

        console.error(
            'REGISTER ERROR:',
            err
        );

        res.status(500).json({
            error: 'حدث خطأ في الخادم'
        });
    }
});


// ====================================================
// 7. AUTH - LOGIN
// ====================================================

app.post('/api/auth/login', async (req, res) => {

    console.log('LOGIN REQUEST RECEIVED');

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                error: 'بيانات الدخول غير صحيحة'
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                error: 'بيانات الدخول غير صحيحة'
            });
        }

        const token =
            jwt.sign(
                {
                    userId: user._id
                },

                process.env.JWT_SECRET ||
                    'linkdent_super_secret_key_2026',

                {
                    expiresIn: '7d'
                }
            );

        const userData = {
            id: user._id,
            email: user.email,
            doctorName: user.doctorName,
            clinicName: user.clinicName,
            logoUrl: user.logoUrl
        };

        res.json({
            success: true,
            token,
            user: userData
        });

    } catch (err) {

        console.error(
            'LOGIN ERROR:',
            err
        );

        res.status(500).json({
            error: 'حدث خطأ في الخادم'
        });
    }
});


// ====================================================
// 8. SETTINGS
// ====================================================

// GET SETTINGS

app.get(
    '/api/settings',
    authenticateToken,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.userId
                ).select('-password');

            if (!user) {

                return res.status(404).json({
                    error: 'المستخدم غير موجود'
                });
            }

            res.json({
                success: true,
                settings: user
            });

        } catch (err) {

            console.error(
                'GET SETTINGS ERROR:',
                err
            );

            res.status(500).json({
                error: 'خطأ'
            });
        }
    }
);


// PUT SETTINGS

app.put(
    '/api/settings',
    authenticateToken,
    async (req, res) => {

        try {

            const allowedFields = [
                'doctorName',
                'clinicName',
                'phone',
                'address',
                'logoUrl',
                'signatureUrl'
            ];

            const updateData = {};

            allowedFields.forEach((field) => {

                if (
                    Object.prototype.hasOwnProperty.call(
                        req.body,
                        field
                    )
                ) {
                    updateData[field] =
                        req.body[field];
                }
            });

            const updatedUser =
                await User.findByIdAndUpdate(
                    req.user.userId,
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                ).select('-password');

            if (!updatedUser) {

                return res.status(404).json({
                    error: 'المستخدم غير موجود'
                });
            }

            res.json({
                success: true,
                settings: updatedUser
            });

        } catch (err) {

            console.error(
                'UPDATE SETTINGS ERROR:',
                err
            );

            res.status(500).json({
                error: 'خطأ'
            });
        }
    }
);


// ====================================================
// 9. PATIENTS
// ====================================================

// CREATE PATIENT

app.post(
    '/api/patients',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                firstName,
                lastName,
                phone,
                cin,
                birthDate,
                medicalHistory
            } = req.body;

            if (!firstName || !lastName) {

                return res.status(400).json({
                    error: 'الاسم الأول واسم العائلة مطلوبان'
                });
            }

            const newPatient =
                new Patient({
                    userId: req.user.userId,

                    firstName,

                    lastName,

                    phone:
                        phone || '',

                    cin:
                        cin || '',

                    birthDate:
                        birthDate || '',

                    medicalHistory:
                        medicalHistory || ''
                });

            await newPatient.save();

            res.json({
                success: true,
                patient: newPatient
            });

        } catch (err) {

            console.error(
                'CREATE PATIENT ERROR:',
                err
            );

            res.status(500).json({
                error: 'خطأ في إضافة المريض'
            });
        }
    }
);


// GET PATIENTS

app.get(
    '/api/patients',
    authenticateToken,
    async (req, res) => {

        try {

            const patients =
                await Patient.find({
                    userId: req.user.userId
                }).sort({
                    createdAt: -1
                });

            res.json({
                success: true,
                patients
            });

        } catch (err) {

            console.error(
                'GET PATIENTS ERROR:',
                err
            );

            res.status(500).json({
                error: 'خطأ في جلب المرضى'
            });
        }
    }
);


// ====================================================
// 10. ODONTOGRAM API
// ====================================================
//
// GET
// جلب Odontogram الخاص بمريض
//
// PUT
// حفظ / تحديث Odontogram الخاص بمريض
//
// DELETE
// حذف Odontogram الخاص بمريض
// ====================================================


// ----------------------------------------------------
// GET ODONTOGRAM
// ----------------------------------------------------

app.get(
    '/api/odontograms/:patientId',
    authenticateToken,
    async (req, res) => {

        try {

            const patientId =
                req.params.patientId;

            // أولاً نتأكد أن المريض تابع للطبيب الحالي
            const patient =
                await Patient.findOne({
                    _id: patientId,
                    userId: req.user.userId
                });

            if (!patient) {

                return res.status(404).json({
                    success: false,
                    error: 'المريض غير موجود أو غير تابع لهذا الحساب'
                });
            }

            // البحث عن Odontogram
            const odontogram =
                await Odontogram.findOne({
                    userId: req.user.userId,
                    patientId: patientId
                });

            // إذا لم يوجد بعد
            if (!odontogram) {

                return res.json({
                    success: true,
                    exists: false,

                    odontogram: {
                        patientId,
                        teethState: {},
                        logs: [],
                        archivedLogs: [],
                        treatedTeeth: []
                    }
                });
            }

            res.json({
                success: true,
                exists: true,
                odontogram
            });

        } catch (err) {

            console.error(
                'GET ODONTOGRAM ERROR:',
                err
            );

            res.status(500).json({
                success: false,
                error: 'خطأ في جلب Odontogram'
            });
        }
    }
);


// ----------------------------------------------------
// SAVE / UPDATE ODONTOGRAM
// ----------------------------------------------------

app.put(
    '/api/odontograms/:patientId',
    authenticateToken,
    async (req, res) => {

        try {

            const patientId =
                req.params.patientId;

            // التأكد من ملكية المريض
            const patient =
                await Patient.findOne({
                    _id: patientId,
                    userId: req.user.userId
                });

            if (!patient) {

                return res.status(404).json({
                    success: false,
                    error: 'المريض غير موجود أو غير تابع لهذا الحساب'
                });
            }

            // نأخذ فقط البيانات الخاصة بالـ Odontogram
            const {
                teethState,
                logs,
                archivedLogs,
                treatedTeeth
            } = req.body;

            const updateData = {
                userId: req.user.userId,
                patientId,

                teethState:
                    teethState || {},

                logs:
                    Array.isArray(logs)
                        ? logs
                        : [],

                archivedLogs:
                    Array.isArray(archivedLogs)
                        ? archivedLogs
                        : [],

                treatedTeeth:
                    Array.isArray(treatedTeeth)
                        ? treatedTeeth
                        : [],

                lastUpdated: new Date()
            };

            // تحديث إذا كان موجودًا
            // أو إنشاء واحد جديد إذا لم يكن موجودًا
            const odontogram =
                await Odontogram.findOneAndUpdate(

                    {
                        userId:
                            req.user.userId,

                        patientId
                    },

                    updateData,

                    {
                        new: true,
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    }
                );

            res.json({
                success: true,
                message:
                    'تم حفظ Odontogram بنجاح',
                odontogram
            });

        } catch (err) {

            console.error(
                'SAVE ODONTOGRAM ERROR:',
                err
            );

            res.status(500).json({
                success: false,
                error: 'خطأ في حفظ Odontogram'
            });
        }
    }
);


// ----------------------------------------------------
// DELETE ODONTOGRAM
// ----------------------------------------------------

app.delete(
    '/api/odontograms/:patientId',
    authenticateToken,
    async (req, res) => {

        try {

            const patientId =
                req.params.patientId;

            // التأكد أن المريض تابع للطبيب
            const patient =
                await Patient.findOne({
                    _id: patientId,
                    userId: req.user.userId
                });

            if (!patient) {

                return res.status(404).json({
                    success: false,
                    error: 'المريض غير موجود'
                });
            }

            await Odontogram.findOneAndDelete({
                userId: req.user.userId,
                patientId
            });

            res.json({
                success: true,
                message:
                    'تم حذف Odontogram بنجاح'
            });

        } catch (err) {

            console.error(
                'DELETE ODONTOGRAM ERROR:',
                err
            );

            res.status(500).json({
                success: false,
                error: 'خطأ في حذف Odontogram'
            });
        }
    }
);


// ====================================================
// 11. OLD / LEGACY FUNCTIONS
// ====================================================

async function findTokenSmart(locationId) {

    if (!locationId) {
        return null;
    }

    const fixedId =
        locationId.replace(/l/g, 'I');

    let token =
        await Token.findOne({
            locationId:
                new RegExp(
                    '^' +
                    fixedId +
                    '$',
                    'i'
                )
        });

    if (!token) {

        token =
            await Token.findOne({
                locationId: {
                    $ne: null
                }
            });
    }

    return token;
}


// ====================================================
// 12. OAUTH CALLBACK
// ====================================================

app.get(
    '/oauth/callback',
    async (req, res) => {

        const { code } =
            req.query;

        if (!code) {

            return res.status(400).send(
                'لم يتم استلام كود.'
            );
        }

        try {

            const response =
                await axios.post(

                    'https://services.leadconnectorhq.com/oauth/token',

                    new URLSearchParams({

                        client_id:
                            process.env.CLIENT_ID,

                        client_secret:
                            process.env.CLIENT_SECRET,

                        grant_type:
                            'authorization_code',

                        code:
                            code,

                        user_type:
                            'Location',

                        redirect_uri:
                            'https://linkdent.onrender.com/oauth/callback'

                    }),

                    {
                        headers: {
                            'Content-Type':
                                'application/x-www-form-urlencoded'
                        }
                    }
                );

            await Token.findOneAndUpdate(

                {
                    locationId:
                        response.data.locationId
                },

                {
                    access_token:
                        response.data.access_token,

                    refresh_token:
                        response.data.refresh_token
                },

                {
                    upsert: true
                }
            );

            res.send(
                'تم الربط بنجاح مع Holiweb! يمكنك إغلاق الصفحة.'
            );

        } catch (err) {

            console.error(
                'OAUTH ERROR:',
                err.response
                    ? err.response.data
                    : err.message
            );

            res.status(500).send(
                'فشل الربط.'
            );
        }
    }
);


// ====================================================
// 13. CLINIC
// ====================================================

app.get(
    '/api/clinic/:slug',
    async (req, res) => {

        try {

            const clinic =
                await Clinic.findOne({
                    slug:
                        req.params.slug
                });

            if (!clinic) {

                return res.status(404).json({
                    error:
                        'العيادة غير موجودة'
                });
            }

            res.json({
                success: true,
                clinic
            });

        } catch (error) {

            console.error(
                'CLINIC ERROR:',
                error
            );

            res.status(500).json({
                error: 'خطأ'
            });
        }
    }
);


// ====================================================
// 14. CONTACTS
// ====================================================

app.get(
    '/api/contacts/:locationId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            if (!tokenData) {

                return res.status(404).json({
                    error:
                        'لا توجد بيانات.'
                });
            }

            const response =
                await axios.get(

                    `https://services.leadconnectorhq.com/contacts/?locationId=${tokenData.locationId}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${tokenData.access_token}`,

                            Version:
                                '2021-07-28'
                        }
                    }
                );

            res.json(
                response.data.contacts
            );

        } catch (err) {

            console.error(
                'CONTACTS ERROR:',
                err.response
                    ? err.response.data
                    : err.message
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// ====================================================
// 15. CLINIC INFO
// ====================================================

app.get(
    '/api/clinic-info/:locationId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            if (!tokenData) {

                return res.status(404).json({
                    error:
                        'العيادة غير متصلة.'
                });
            }

            const dbClinic =
                await Clinic.findOne({
                    locationId:
                        new RegExp(
                            '^' +
                            tokenData.locationId +
                            '$',
                            'i'
                        )
                });

            const response =
                await axios.get(

                    `https://services.leadconnectorhq.com/locations/${tokenData.locationId}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${tokenData.access_token}`,

                            Version:
                                '2021-07-28',

                            Accept:
                                'application/json'
                        }
                    }
                );

            res.json({

                success: true,

                clinic: {

                    doctorName:
                        dbClinic
                            ? dbClinic.doctorName
                            : 'Dr.',

                    clinicName:
                        dbClinic
                            ? dbClinic.clinicName
                            : (
                                response.data.location.name ||
                                'Vitalia'
                            ),

                    logo:
                        dbClinic
                            ? dbClinic.logo
                            : (
                                response.data.location.logoUrl ||
                                ''
                            ),

                    phone:
                        dbClinic
                            ? dbClinic.phone
                            : (
                                response.data.location.phone ||
                                ''
                            ),

                    address:
                        dbClinic
                            ? dbClinic.address
                            : (
                                `${response.data.location.city || 'Tanger'}, ${response.data.location.country || 'Maroc'}`
                            ),

                    locationId:
                        tokenData.locationId
                }

            });

        } catch (err) {

            console.error(
                'CLINIC INFO ERROR:',
                err.response
                    ? err.response.data
                    : err.message
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// ====================================================
// 16. PRESCRIPTION
// ====================================================

app.post(
    '/api/save-prescription/:locationId/:contactId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            if (!tokenData) {

                return res.status(404).json({
                    error:
                        'غير متصل'
                });
            }

            const response =
                await axios.post(

                    `https://services.leadconnectorhq.com/contacts/${req.params.contactId}/notes`,

                    {
                        body:
                            `📝 **وصفة طبية جديدة (Ordonnance)**\n\nالأدوية الموصوفة:\n${req.body.medications}`
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${tokenData.access_token}`,

                            Version:
                                '2021-07-28',

                            'Content-Type':
                                'application/json'
                        }
                    }
                );

            res.json({
                success: true,
                note:
                    response.data
            });

        } catch (err) {

            console.error(
                'PRESCRIPTION ERROR:',
                err.response
                    ? err.response.data
                    : err.message
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// ====================================================
// 17. MEDICAL CERTIFICATE
// ====================================================

app.post(
    '/api/save-certificate/:locationId/:contactId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            if (!tokenData) {

                return res.status(404).json({
                    error:
                        'غير متصل'
                });
            }

            const response =
                await axios.post(

                    `https://services.leadconnectorhq.com/contacts/${req.params.contactId}/notes`,

                    {
                        body:
                            req.body.certificateText
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${tokenData.access_token}`,

                            Version:
                                '2021-07-28',

                            'Content-Type':
                                'application/json'
                        }
                    }
                );

            res.json({
                success: true,
                note:
                    response.data
            });

        } catch (err) {

            console.error(
                'CERTIFICATE ERROR:',
                err.response
                    ? err.response.data
                    : err.message
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// ====================================================
// 18. REVENUE
// ====================================================

app.get(
    '/api/revenue/:locationId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            if (!tokenData) {

                return res.json({
                    success: true,
                    revenue: 0
                });
            }

            const headers = {

                Authorization:
                    `Bearer ${tokenData.access_token}`,

                Version:
                    '2021-07-28',

                Accept:
                    'application/json'
            };

            let totalRevenue = 0;

            try {

                const txResponse =
                    await axios.get(

                        `https://services.leadconnectorhq.com/payments/transactions?altId=${tokenData.locationId}&altType=location`,

                        {
                            headers
                        }
                    );

                const txList =
                    txResponse.data.data ||
                    txResponse.data.transactions ||
                    [];

                txList.forEach(
                    (tx) => {

                        totalRevenue +=
                            Number(
                                tx.amount ||
                                tx.totalAmount ||
                                tx.total ||
                                0
                            );
                    }
                );

            } catch (e) {

                console.error(
                    'Holiweb Revenue Fetch Error:',
                    e.response
                        ? e.response.data
                        : e.message
                );
            }

            res.json({
                success: true,
                revenue:
                    totalRevenue
            });

        } catch (err) {

            res.json({
                success: true,
                revenue: 0,
                error:
                    'server_error'
            });
        }
    }
);


// ====================================================
// 19. RECORD TRANSACTION
// ====================================================

app.post(
    '/api/record-transaction/:locationId/:contactId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            if (!tokenData) {

                return res.status(404).json({
                    error:
                        'غير متصل'
                });
            }

            const {
                devisTotal,
                amountPaid,
                items,
                paymentMode
            } = req.body;

            const headers = {

                Authorization:
                    `Bearer ${tokenData.access_token}`,

                Version:
                    '2021-07-28',

                'Content-Type':
                    'application/json'
            };

            const today =
                new Date()
                    .toISOString()
                    .split('T')[0];

            const invoicePayload = {

                altId:
                    tokenData.locationId,

                altType:
                    'location',

                contactId:
                    req.params.contactId,

                name:
                    `فاتورة ${Date.now()
                        .toString()
                        .slice(-5)}`,

                title:
                    'خطة علاج (Holiweb)',

                issueDate:
                    today,

                dueDate:
                    today,

                currency:
                    'MAD',

                businessDetails: {},

                contactDetails: {},

                lineItems:
                    (items || []).map(
                        (item) => ({

                            name:
                                `السن ${item.tooth} - ${item.acte}`,

                            price:
                                Math.round(
                                    Number(
                                        item.price
                                    )
                                ),

                            qty: 1
                        })
                    )
            };

            let invoiceId = null;

            try {

                const invoiceRes =
                    await axios.post(

                        'https://services.leadconnectorhq.com/invoices/',

                        invoicePayload,

                        {
                            headers
                        }
                    );

                invoiceId =
                    invoiceRes.data._id ||
                    invoiceRes.data.id;

            } catch (invoiceErr) {

                console.error(
                    'Holiweb Invoice Creation Error:',
                    invoiceErr.response
                        ? invoiceErr.response.data
                        : invoiceErr.message
                );

                return res.json({
                    success: false,
                    error:
                        'فشل إنشاء الفاتورة في Holiweb. تأكد من تفعيل صلاحيات الكتابة.'
                });
            }

            if (
                invoiceId &&
                Number(amountPaid) > 0
            ) {

                try {

                    await axios.post(

                        `https://services.leadconnectorhq.com/invoices/${invoiceId}/record-payment`,

                        {

                            amount:
                                Math.round(
                                    Number(
                                        amountPaid
                                    )
                                ),

                            paymentMode:
                                'cash',

                            note:
                                paymentMode ===
                                'full'
                                    ? 'دفع كامل'
                                    : 'تسبيق'
                        },

                        {
                            headers
                        }
                    );

                } catch (paymentErr) {

                    console.error(
                        'Holiweb Payment Record Error:',
                        paymentErr.response
                            ? paymentErr.response.data
                            : paymentErr.message
                    );
                }
            }

            res.json({

                success: true,

                message:
                    'تم تسجيل المعاملة في Holiweb'
            });

        } catch (err) {

            console.error(
                'TRANSACTION ERROR:',
                err
            );

            res.json({
                success: false,
                error:
                    'خطأ في الاتصال'
            });
        }
    }
);


// ====================================================
// 20. EXPENSES
// ====================================================

// CREATE EXPENSE

app.post(
    '/api/expenses/:locationId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            const locId =
                tokenData
                    ? tokenData.locationId
                    : req.params.locationId;

            const newExpense =
                new Expense({

                    ...req.body,

                    locationId:
                        locId
                });

            await newExpense.save();

            res.json({
                success: true,
                expense:
                    newExpense
            });

        } catch (err) {

            console.error(
                'CREATE EXPENSE ERROR:',
                err
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// GET EXPENSES

app.get(
    '/api/expenses/:locationId',
    async (req, res) => {

        try {

            const tokenData =
                await findTokenSmart(
                    req.params.locationId
                );

            const locId =
                tokenData
                    ? tokenData.locationId
                    : req.params.locationId;

            const expenses =
                await Expense.find({
                    locationId:
                        locId
                }).sort({
                    createdAt: -1
                });

            res.json({
                success: true,
                expenses
            });

        } catch (err) {

            console.error(
                'GET EXPENSES ERROR:',
                err
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// DELETE EXPENSE

app.delete(
    '/api/expenses/:id',
    async (req, res) => {

        try {

            await Expense.findByIdAndDelete(
                req.params.id
            );

            res.json({
                success: true
            });

        } catch (err) {

            console.error(
                'DELETE EXPENSE ERROR:',
                err
            );

            res.status(500).json({
                error: 'فشل'
            });
        }
    }
);


// ====================================================
// 21. SERVER
// ====================================================

const PORT =
    process.env.PORT || 10000;

app.listen(
    PORT,
    () =>
        console.log(
            `Server running on port ${PORT}`
        )
);