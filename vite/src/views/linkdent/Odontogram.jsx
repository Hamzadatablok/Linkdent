import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Avatar,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip
} from '@mui/material';

import {
  IconReceipt,
  IconSettings,
  IconHistory
} from '@tabler/icons-react';

import { useAppContext } from '../../AppContext';


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:10000';


/* =========================================================
   TREATMENTS
========================================================= */

const BASE_TRAITEMENTS = {
  healthy: {
    id: 'healthy',
    label: 'Healthy',
    color: '#a7b4d1',
    stroke: '#0b0c0c'
  },

  caries: {
    id: 'caries',
    label: 'Caries',
    color: '#ef4444',
    stroke: '#b91c1c'
  },

  filling: {
    id: 'filling',
    label: 'Filling',
    color: '#3b82f6',
    stroke: '#1d4ed8'
  },

  crown: {
    id: 'crown',
    label: 'Crown',
    color: '#eab308',
    stroke: '#a16207'
  },

  endo: {
    id: 'endo',
    label: 'Endodontic Treatment',
    color: '#a855f7',
    stroke: '#7e22ce'
  },

  implant: {
    id: 'implant',
    label: 'Implant',
    color: '#0d9488',
    stroke: '#115e59'
  },

  extracted: {
    id: 'extracted',
    label: 'Extracted Tooth',
    color: '#475569',
    stroke: '#1e293b'
  },

  eraser: {
    id: 'eraser',
    label: 'Eraser',
    color: '#0f172a',
    stroke: '#64748b'
  }
};


/* =========================================================
   TOOTH SURFACES
========================================================= */

const SURFACES_EN = {
  top: 'Vestibular (V)',
  bottom: 'Lingual/Palatal (L/P)',
  left: 'Distal (D)',
  right: 'Mesial (M)',
  center: 'Occlusal/Incisal (O/I)',
  root: 'Root (R)'
};


/* =========================================================
   TOOTH QUADRANTS
========================================================= */

const QUADRANT_1 = [
  18, 17, 16, 15, 14, 13, 12, 11
];

const QUADRANT_2 = [
  21, 22, 23, 24, 25, 26, 27, 28
];

const QUADRANT_4 = [
  48, 47, 46, 45, 44, 43, 42, 41
];

const QUADRANT_3 = [
  31, 32, 33, 34, 35, 36, 37, 38
];


/* =========================================================
   TOOTH COMPONENT
========================================================= */

const DentAnatomique = ({
  number,
  isUpper,
  toothData,
  onSurfaceClick,
  dynamicTraitements
}) => {

  const getColor = (surface) => {
    const treatment = toothData?.[surface];

    if (
      treatment &&
      dynamicTraitements[treatment]
    ) {
      return dynamicTraitements[treatment].color;
    }

    return dynamicTraitements.healthy.color;
  };


  const getStroke = (surface) => {
    const treatment = toothData?.[surface];

    if (
      treatment &&
      dynamicTraitements[treatment]
    ) {
      return dynamicTraitements[treatment].stroke;
    }

    return dynamicTraitements.healthy.stroke;
  };


  const isExtracted =
    toothData?.center === 'extracted';


  const isImplant =
    toothData?.root === 'implant';


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        m: 0.3
      }}
    >

      {isUpper && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: '800',
            mb: 0.5,
            color: '#94a3b8'
          }}
        >
          {number}
        </Typography>
      )}


      <Box
        sx={{
          width: 44,
          height: 85,
          cursor: 'pointer',
          filter:
            'drop-shadow(0px 4px 6px rgba(75, 67, 67, 0.3))',
          transition:
            'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

          '&:hover': {
            transform:
              'translateY(-4px) scale(1.05)'
          }
        }}
      >

        <svg
          viewBox="0 0 100 140"
          width="100%"
          height="100%"
        >

          {isUpper ? (

            <g>

              <path
                d="M 25,50 Q 35,10 50,25 Q 65,10 75,50 Z"
                fill={getColor('root')}
                stroke={getStroke('root')}
                strokeWidth="2.5"
                onClick={() =>
                  onSurfaceClick(number, 'root')
                }
              />

              <polygon
                points="20,50 80,50 65,70 35,70"
                fill={getColor('top')}
                stroke={getStroke('top')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'top')
                }
              />

              <polygon
                points="35,100 65,100 80,120 20,120"
                fill={getColor('bottom')}
                stroke={getStroke('bottom')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'bottom')
                }
              />

              <polygon
                points="20,50 35,70 35,100 20,120"
                fill={getColor('left')}
                stroke={getStroke('left')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'left')
                }
              />

              <polygon
                points="80,50 65,70 65,100 80,120"
                fill={getColor('right')}
                stroke={getStroke('right')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'right')
                }
              />

              <polygon
                points="35,70 65,70 65,100 35,100"
                fill={getColor('center')}
                stroke={getStroke('center')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'center')
                }
              />

            </g>

          ) : (

            <g>

              <polygon
                points="20,20 80,20 65,40 35,40"
                fill={getColor('top')}
                stroke={getStroke('top')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'top')
                }
              />

              <polygon
                points="35,70 65,70 80,90 20,90"
                fill={getColor('bottom')}
                stroke={getStroke('bottom')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'bottom')
                }
              />

              <polygon
                points="20,20 35,40 35,70 20,90"
                fill={getColor('left')}
                stroke={getStroke('left')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'left')
                }
              />

              <polygon
                points="80,20 65,40 65,70 80,90"
                fill={getColor('right')}
                stroke={getStroke('right')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'right')
                }
              />

              <polygon
                points="35,40 65,40 65,70 35,70"
                fill={getColor('center')}
                stroke={getStroke('center')}
                strokeWidth="2"
                onClick={() =>
                  onSurfaceClick(number, 'center')
                }
              />

              <path
                d="M 25,90 Q 35,130 50,110 Q 65,130 75,90 Z"
                fill={getColor('root')}
                stroke={getStroke('root')}
                strokeWidth="2.5"
                onClick={() =>
                  onSurfaceClick(number, 'root')
                }
              />

            </g>
          )}


          {isImplant && (

            <g
              transform={
                isUpper
                  ? "translate(35, 15)"
                  : "translate(35, 95)"
              }
            >

              <rect
                x="5"
                y="0"
                width="20"
                height="8"
                fill="#334155"
                stroke="#94a3b8"
                rx="2"
              />

              <line
                x1="15"
                y1="5"
                x2="15"
                y2="25"
                stroke="#94a3b8"
                strokeWidth="4"
                strokeDasharray="2,2"
              />

            </g>
          )}


          {isExtracted && (

            <path
              d="M 15,30 L 85,110 M 85,30 L 15,110"
              stroke="#ef4444"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.9"
            />

          )}

        </svg>

      </Box>


      {!isUpper && (

        <Typography
          variant="caption"
          sx={{
            fontWeight: '800',
            mt: 0.5,
            color: '#94a3b8'
          }}
        >
          {number}
        </Typography>

      )}

    </Box>
  );
};


/* =========================================================
   MAIN ODONTOGRAM
========================================================= */

const OdontogrammePro = () => {

  const [searchParams] = useSearchParams();

  const { clinicSettings } = useAppContext();


  /* =======================================================
     CLINIC DATA
  ======================================================= */

  const [clinicData, setClinicData] =
    useState(clinicSettings);


  /* =======================================================
     PATIENT DATA
  ======================================================= */

  const [contactsList, setContactsList] =
    useState([]);

  const [selectedContactId, setSelectedContactId] =
    useState('');

  const [selectedContact, setSelectedContact] =
    useState(null);


  /* =======================================================
     LOADING / SAVING
  ======================================================= */

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);


  /* =======================================================
     PRICES
  ======================================================= */

  const defaultPrices = {
    filling: 400,
    crown: 2500,
    endo: 800,
    implant: 6000,
    extracted: 300
  };


  const [customPrices, setCustomPrices] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem(
            'linkdent_prices'
          );

        return saved
          ? JSON.parse(saved)
          : defaultPrices;

      } catch (error) {

        console.error(
          'Error loading prices:',
          error
        );

        return defaultPrices;
      }

    });


  const [isPriceSettingsOpen, setIsPriceSettingsOpen] =
    useState(false);


  /* =======================================================
     DYNAMIC TREATMENTS
  ======================================================= */

  const DYNAMIC_TRAITEMENTS = useMemo(() => {

    const treatments = {
      ...BASE_TRAITEMENTS
    };


    treatments.healthy.price = 0;
    treatments.caries.price = 0;
    treatments.eraser.price = 0;

    treatments.filling.price =
      customPrices.filling;

    treatments.crown.price =
      customPrices.crown;

    treatments.endo.price =
      customPrices.endo;

    treatments.implant.price =
      customPrices.implant;

    treatments.extracted.price =
      customPrices.extracted;


    return treatments;

  }, [customPrices]);


  /* =======================================================
     ODONTOGRAM STATE
  ======================================================= */

  const [activeTool, setActiveTool] =
    useState(
      DYNAMIC_TRAITEMENTS.caries.id
    );

  const [teethState, setTeethState] =
    useState({});

  const [logs, setLogs] =
    useState([]);

  // Archived sessions are kept separately so starting a new
  // session never destroys the patient's previous history.
  const [archivedLogs, setArchivedLogs] =
    useState([]);

  // Prevent auto-save before the selected patient's data
  // has finished loading from MongoDB.
  const [isOdontogramLoaded, setIsOdontogramLoaded] =
    useState(false);

  const [isOdontogramLoading, setIsOdontogramLoading] =
    useState(false);

  // Debounce MongoDB writes while clicking several surfaces quickly.
  const saveTimerRef = useRef(null);

  /* =======================================================
     4D DENTAL CURSOR
  ======================================================= */

  const [mousePosition, setMousePosition] = useState({
    x: -100,
    y: -100
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  /* =======================================================
     DEVIs / CHECKOUT
  ======================================================= */

  const [isDevisOpen, setIsDevisOpen] =
    useState(false);

  const [devisItems, setDevisItems] =
    useState([]);

  const [devisTotal, setDevisTotal] =
    useState(0);


  /* =======================================================
     PAYMENT
  ======================================================= */

  const [paymentMode, setPaymentMode] =
    useState('full');

  const [advancePayment, setAdvancePayment] =
    useState(0);

  const [installmentsCount, setInstallmentsCount] =
    useState(2);


  const remainingAmount =
    devisTotal - advancePayment;


  /* =======================================================
     CLINIC SETTINGS
  ======================================================= */

  useEffect(() => {

    if (clinicSettings) {
      setClinicData(clinicSettings);
    }

  }, [clinicSettings]);


  /* =========================================================
     LOAD PATIENTS FROM BACKEND / MONGODB
     
     IMPORTANT:
     This replaces the old localStorage-based loading.
  ========================================================= */

  useEffect(() => {

    const loadPlatformPatients = async () => {

      setIsLoading(true);


      try {

        const token =
          localStorage.getItem(
            'linkdent_token'
          );


        if (!token) {

          console.warn(
            'No Linkdent authentication token found.'
          );

          setContactsList([]);
          setSelectedContactId('');
          setSelectedContact(null);

          return;
        }


        const response = await fetch(
          `${API_BASE_URL}/api/patients`,
          {
            method: 'GET',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            }
          }
        );


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(
            data.error ||
            'Failed to load patients'
          );
        }


        /*
          Backend can return:
          
          patients: [...]
          
          or
          
          patients: {...}
        */

        const patientsArray =
          Array.isArray(data.patients)
            ? data.patients
            : Object.values(
                data.patients || {}
              );


        /*
          Convert backend patients
          into the format required
          by the Odontogram dropdown.
        */

        const platformContacts =
          patientsArray
            .map((patient) => {

              const patientId =
                patient.id ||
                patient._id;


              const firstName =
                patient.firstName ||
                '';

              const lastName =
                patient.lastName ||
                '';


              const fullName =
                `${firstName} ${lastName}`
                  .trim();


              return {

                id: String(
                  patientId || ''
                ),

                fullName:
                  fullName ||
                  patient.fullName ||
                  'Unnamed Patient',

                firstName,

                lastName,

                cin:
                  patient.cin ||
                  patient.idNumber ||
                  '',

                phone:
                  patient.phone ||
                  patient.contactNumber ||
                  '',

                insurance:
                  patient.insurance ||
                  patient.insuranceProvider ||
                  '',

                matricule:
                  patient.matricule ||
                  '',

                relationship:
                  patient.relationship ||
                  '',

                rawPatient:
                  patient

              };

            })
            .filter(
              (patient) =>
                patient.id
            );


        setContactsList(
          platformContacts
        );


        /*
          If URL contains:
          
          ?patient_id=...
          
          automatically select that patient.
        */

        const pId =
          searchParams.get(
            'patient_id'
          );


        if (pId) {

          const found =
            platformContacts.find(
              (contact) =>
                String(contact.id) ===
                String(pId)
            );


          if (found) {

            setSelectedContactId(
              found.id
            );

            setSelectedContact(
              found
            );

          }

        }


        console.log(
          '✅ Odontogram patients loaded from backend:',
          platformContacts
        );


      } catch (error) {

        console.error(
          '❌ Error loading patients from backend:',
          error
        );


        setContactsList([]);


        alert(
          `❌ Unable to load patients from database.\n\n${error.message}`
        );


      } finally {

        setIsLoading(false);

      }

    };


    loadPlatformPatients();

  }, [searchParams]);


  /* =========================================================
     LOAD ODONTOGRAM FOR SELECTED PATIENT

     MongoDB is the primary source of truth.

     Migration safety:
     If MongoDB has no real Odontogram yet, an existing legacy
     localStorage record is loaded once and then migrated to
     MongoDB by the auto-save effect below.
  ========================================================= */

  useEffect(() => {

    let cancelled = false;

    const loadOdontogram = async () => {

      if (!selectedContactId) {

        setIsOdontogramLoaded(false);
        setIsOdontogramLoading(false);

        setTeethState({});
        setLogs([]);
        setArchivedLogs([]);

        return;
      }

      setIsOdontogramLoading(true);
      setIsOdontogramLoaded(false);

      // Immediately clear the previous patient's map.
      setTeethState({});
      setLogs([]);
      setArchivedLogs([]);

      try {

        const token =
          localStorage.getItem(
            'linkdent_token'
          );

        if (!token) {
          throw new Error(
            'Authentication token not found.'
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/odontograms/${selectedContactId}`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
            'Failed to load odontogram.'
          );
        }

        if (cancelled) {
          return;
        }

        const serverOdontogram =
          data.odontogram;

        /*
         * MongoDB is the primary source of truth.
         *
         * IMPORTANT:
         * If MongoDB contains a record, even an EMPTY record,
         * we must use it. Otherwise an old localStorage record
         * could incorrectly come back after the dentist starts
         * a new blank session.
         */
        if (serverOdontogram) {

          setTeethState(
            serverOdontogram.teethState || {}
          );

          setLogs(
            serverOdontogram.logs || []
          );

          setArchivedLogs(
            serverOdontogram.archivedLogs || []
          );

          console.log(
            '✅ Odontogram loaded from MongoDB:',
            selectedContactId
          );

        } else {

          /*
           * Migration fallback:
           * Only use the old localStorage record when MongoDB
           * does not have an Odontogram document for this patient.
           */
          let migrated = null;

          try {

            const savedOdontograms =
              JSON.parse(
                localStorage.getItem(
                  'linkdent_odontograms'
                )
              ) || [];

            migrated =
              savedOdontograms.find(
                (odontogram) =>
                  String(
                    odontogram.patientId
                  ) ===
                  String(
                    selectedContactId
                  )
              );

          } catch (migrationError) {

            console.warn(
              'Could not read legacy localStorage odontogram:',
              migrationError
            );

          }

          if (migrated) {

            setTeethState(
              migrated.teethState || {}
            );

            setLogs(
              migrated.logs || []
            );

            setArchivedLogs(
              migrated.archivedLogs || []
            );

            console.log(
              '🔄 Legacy odontogram loaded for migration to MongoDB:',
              selectedContactId
            );

          } else {

            setTeethState({});
            setLogs([]);
            setArchivedLogs([]);

            console.log(
              'ℹ️ No previous odontogram found for patient:',
              selectedContactId
            );

          }

        }

        if (!cancelled) {
          setIsOdontogramLoaded(true);
        }

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          '❌ Error loading odontogram:',
          error
        );

        setTeethState({});
        setLogs([]);
        setArchivedLogs([]);

        setIsOdontogramLoaded(false);

      } finally {

        if (!cancelled) {
          setIsOdontogramLoading(false);
        }

      }

    };

    loadOdontogram();

    return () => {
      cancelled = true;
    };

  }, [selectedContactId]);


  /* =========================================================
     AUTO-SAVE ODONTOGRAM TO MONGODB

     MongoDB is the primary storage.

     A small debounce prevents many requests when the dentist
     clicks several tooth surfaces quickly.
  ========================================================= */

  useEffect(() => {

    if (
      !selectedContactId ||
      !isOdontogramLoaded
    ) {
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(
        saveTimerRef.current
      );
    }

    saveTimerRef.current =
      setTimeout(
        async () => {

          try {

            const token =
              localStorage.getItem(
                'linkdent_token'
              );

            if (!token) {
              console.warn(
                '⚠️ Cannot save odontogram: authentication token missing.'
              );
              return;
            }

            const response =
              await fetch(
                `${API_BASE_URL}/api/odontograms/${selectedContactId}`,
                {
                  method: 'PUT',

                  headers: {
                    'Content-Type':
                      'application/json',

                    Authorization:
                      `Bearer ${token}`
                  },

                  body:
                    JSON.stringify({

                      teethState,

                      logs,

                      archivedLogs,

                      treatedTeeth:
                        Object.keys(
                          teethState
                        )

                    })
                }
              );

            const data =
              await response.json();

            if (
              !response.ok ||
              !data.success
            ) {
              throw new Error(
                data.error ||
                'Failed to save odontogram.'
              );
            }

            console.log(
              '✅ Odontogram saved to MongoDB:',
              selectedContactId
            );

          } catch (error) {

            console.error(
              '❌ Error saving odontogram to MongoDB:',
              error
            );

          }

        },
        600
      );

    return () => {

      if (saveTimerRef.current) {

        clearTimeout(
          saveTimerRef.current
        );

      }

    };

  }, [
    teethState,
    logs,
    archivedLogs,
    selectedContactId,
    isOdontogramLoaded
  ]);


  /* =========================================================
     SELECT PATIENT
  ========================================================= */

  const handleSelectPatient = (e) => {

    const contactId =
      e.target.value;


    setSelectedContactId(
      contactId
    );


    const contact =
      contactId
        ? contactsList.find(
            (contact) =>
              String(
                contact.id
              ) ===
              String(
                contactId
              )
          )
        : null;


    setSelectedContact(
      contact || null
    );

  };


  /* =========================================================
     SAVE PRICES
  ========================================================= */

  const handleSavePrices = () => {

    try {

      localStorage.setItem(
        'linkdent_prices',
        JSON.stringify(
          customPrices
        )
      );


      setIsPriceSettingsOpen(
        false
      );


      alert(
        '✅ Clinic price list updated and saved successfully.'
      );


    } catch (error) {

      console.error(
        'Error saving prices:',
        error
      );


      alert(
        '❌ Failed to save pricing.'
      );

    }

  };


  /* =========================================================
     START NEW SESSION

     The current session is moved to archivedLogs in React
     state. The MongoDB auto-save effect then persists the
     complete new state.
  ========================================================= */

  const handleNewSession = () => {

    if (!selectedContactId) {

      alert(
        '⚠️ Please select a patient first.'
      );

      return;
    }

    if (
      logs.length === 0 &&
      Object.keys(teethState).length === 0
    ) {

      alert(
        'ℹ️ The dental map and invoice are already empty. You can start your new session immediately!'
      );

      return;
    }

    if (
      window.confirm(
        'Are you sure you want to archive the current treatments AND clear the dental map to start a completely new session?'
      )
    ) {

      const sessionArchive = {

        sessionId:
          Date.now(),

        date:
          new Date().toLocaleString(
            'en-GB'
          ),

        logs: [
          ...logs
        ],

        teethState: {
          ...teethState
        }

      };

      setArchivedLogs(
        (prev) => [
          ...prev,
          sessionArchive
        ]
      );

      setLogs([]);
      setTeethState({});

      alert(
        '✅ Previous session archived successfully. The new blank session will be saved to MongoDB.'
      );

    }

  };


  /* =========================================================
     TOOTH SURFACE CLICK
  ========================================================= */

  const handleSurfaceClick = (
    toothNumber,
    surface
  ) => {

    setTeethState((prev) => {

      const currentTooth =
        prev[toothNumber] || {};


      /* -----------------------------------------------
         ERASER
      ----------------------------------------------- */

      if (
        activeTool ===
        'eraser'
      ) {

        const newToothState = {
          ...currentTooth
        };


        delete newToothState[
          surface
        ];


        if (
          currentTooth.center ===
            'extracted' ||
          currentTooth.root ===
            'implant'
        ) {

          return {
            ...prev,
            [toothNumber]: {}
          };

        }


        return {
          ...prev,
          [toothNumber]:
            newToothState
        };

      }


      /* -----------------------------------------------
         EXTRACTED TOOTH
      ----------------------------------------------- */

      if (
        activeTool ===
        'extracted'
      ) {

        return {

          ...prev,

          [toothNumber]: {

            top:
              'extracted',

            bottom:
              'extracted',

            left:
              'extracted',

            right:
              'extracted',

            center:
              'extracted',

            root:
              'extracted'

          }

        };

      }


      /* -----------------------------------------------
         IMPLANT
      ----------------------------------------------- */

      if (
        activeTool ===
        'implant'
      ) {

        return {

          ...prev,

          [toothNumber]: {

            top:
              'implant',

            bottom:
              'implant',

            left:
              'implant',

            right:
              'implant',

            center:
              'implant',

            root:
              'implant'

          }

        };

      }


      /* -----------------------------------------------
         NORMAL TREATMENT
      ----------------------------------------------- */

      return {

        ...prev,

        [toothNumber]: {

          ...currentTooth,

          [surface]:
            activeTool

        }

      };

    });


    /* =====================================================
       CREATE TREATMENT LOG
    ===================================================== */

    if (
      activeTool !==
        'healthy' &&
      activeTool !==
        'eraser'
    ) {

      const treatment =
        DYNAMIC_TRAITEMENTS[
          activeTool
        ];


      if (!treatment) {
        return;
      }


      const newLog = {

        id:
          Date.now(),

        date:
          new Date()
            .toLocaleDateString(
              'en-GB',
              {
                hour:
                  '2-digit',

                minute:
                  '2-digit'
              }
            ),

        tooth:
          toothNumber,

        surface:
          activeTool ===
            'extracted' ||
          activeTool ===
            'implant'
            ? 'Entire Tooth'
            : SURFACES_EN[
                surface
              ],

        acteId:
          activeTool,

        acte:
          treatment.label,

        price:
          treatment.price

      };


      setLogs(
        (prev) => [
          newLog,
          ...prev
        ]
      );

    }

  };


  /* =========================================================
     GENERATE DEVIS
  ========================================================= */

  const handleGenerateDevis = () => {

    if (!selectedContactId) {

      alert(
        '⚠️ Please select a patient first.'
      );

      return;
    }


    const billableItems =
      logs.filter(
        (log) =>
          log.price > 0
      );


    if (
      billableItems.length === 0
    ) {

      alert(
        '⚠️ There are no paid treatments in the log to create an invoice.'
      );

      return;
    }


    let total = 0;


    billableItems.forEach(
      (item) => {

        total +=
          Number(
            item.price
          ) || 0;

      }
    );


    setDevisItems(
      billableItems
    );


    setDevisTotal(
      total
    );


    setAdvancePayment(
      Math.round(
        total / 2
      )
    );


    setIsDevisOpen(
      true
    );

  };


  /* =========================================================
     PROCESS PAYMENT
  ========================================================= */

  const handleProcessPayment = () => {

    setIsSaving(true);


    const amountToPay =
      paymentMode ===
      'full'
        ? devisTotal
        : advancePayment;


    const newInvoice = {

      id:
        Date.now(),

      patientId:
        selectedContactId,

      patientName:
        selectedContact?.fullName ||
        'Unknown Patient',

      date:
        new Date()
          .toLocaleDateString(
            'en-GB'
          ),

      total:
        devisTotal,

      paid:
        amountToPay,

      remaining:
        paymentMode ===
        'full'
          ? 0
          : remainingAmount,

      mode:
        paymentMode,

      installmentsCount:
        paymentMode ===
        'split'
          ? installmentsCount
          : 0,

      items:
        devisItems

    };


    try {

      const savedInvoices =
        JSON.parse(
          localStorage.getItem(
            'linkdent_invoices'
          )
        ) || [];


      savedInvoices.push(
        newInvoice
      );


      localStorage.setItem(
        'linkdent_invoices',
        JSON.stringify(
          savedInvoices
        )
      );


      alert(
        '✅ Payment processed and invoice issued successfully!'
      );


      setIsDevisOpen(
        false
      );


    } catch (err) {

      console.error(
        'Invoice error:',
        err
      );


      alert(
        '❌ An unexpected error occurred.'
      );


    } finally {

      setIsSaving(false);

    }

  };


  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (isLoading) {

    return (

      <Box
        sx={{
          display: 'flex',
          justifyContent:
            'center',
          alignItems:
            'center',
          minHeight:
            '60vh'
        }}
      >

        <CircularProgress />

      </Box>

    );

  }


  /* =========================================================
     PATIENT DISPLAY NAME
  ========================================================= */

  const patientDisplayName =
    selectedContact
      ? selectedContact.fullName
      : 'Patient Not Selected';

  const odontogramStatusText =
    isOdontogramLoading
      ? 'Loading patient dental history...'
      : isOdontogramLoaded
        ? 'Odontogram synced with MongoDB'
        : 'Select a patient to load dental history';


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <>
      {/* 🦷 LINKDENT 4D DENTAL CURSOR */}
      <Box
        sx={{
          position: 'fixed',
          left: mousePosition.x,
          top: mousePosition.y,
          width: 46,
          height: 46,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'left 0.06s linear, top 0.06s linear',
          filter: 'drop-shadow(0 0 7px rgba(34,211,238,0.95)) drop-shadow(0 0 18px rgba(37,99,235,0.55))'
        }}
      >
        <Box sx={{ position: 'absolute', inset: -5, border: '1px solid rgba(34,211,238,0.45)', borderRadius: '50%', animation: 'linkdentCursorRing 1.5s ease-out infinite' }} />
        <svg viewBox="0 0 100 120" width="100%" height="100%">
          <defs>
            <linearGradient id="linkdentCursorTooth" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="42%" stopColor="#dff9ff" />
              <stop offset="72%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M22 29 C25 10 40 7 50 16 C60 7 75 10 78 29 C81 46 73 63 68 82 C65 97 59 108 50 108 C41 108 35 97 32 82 C27 63 19 46 22 29 Z" fill="url(#linkdentCursorTooth)" stroke="#ecfeff" strokeWidth="3" />
          <ellipse cx="42" cy="36" rx="13" ry="9" fill="rgba(255,255,255,0.72)" transform="rotate(-25 42 36)" />
          <circle cx="50" cy="50" r="7" fill="#ffffff" opacity="0.85" />
        </svg>
      </Box>

      {/* 🌌 MEDICAL / DIGITAL DENTISTRY ENVIRONMENT */}
      <Box
        sx={{
          p: { xs: 2, md: 5 },
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: `
            radial-gradient(circle at 8% 12%, rgba(14,165,233,0.17) 0%, transparent 30%),
            radial-gradient(circle at 92% 18%, rgba(37,99,235,0.14) 0%, transparent 28%),
            radial-gradient(circle at 55% 105%, rgba(6,182,212,0.12) 0%, transparent 34%),
            linear-gradient(135deg, #eef7fb 0%, #dbeafe 48%, #f8fafc 100%)
          `,
          fontFamily: '"Inter", sans-serif',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(14,165,233,0.055) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.055) 1px, transparent 1px)
            `,
            backgroundSize: '42px 42px',
            maskImage: 'linear-gradient(to bottom, black, transparent 92%)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 620,
            height: 620,
            borderRadius: '50%',
            top: -300,
            right: -230,
            background: 'radial-gradient(circle, rgba(56,189,248,0.17), transparent 68%)',
            filter: 'blur(8px)',
            pointerEvents: 'none'
          },
          '@keyframes linkdentCursorRing': {
            '0%': { transform: 'scale(0.75)', opacity: 0.9 },
            '100%': { transform: 'scale(1.45)', opacity: 0 }
          },
          '@keyframes linkdentPageEnter': {
            from: { opacity: 0, transform: 'translateY(16px) scale(0.988)' },
            to: { opacity: 1, transform: 'translateY(0) scale(1)' }
          }
        }}
      >
      <Box
        className="no-print"
        sx={{
          maxWidth: '1200px',
          margin: 'auto',
          position: 'relative',
          zIndex: 2,
          animation: 'linkdentPageEnter 0.75s cubic-bezier(0.22,1,0.36,1)'
        }}
      >


        {/* =================================================
            PATIENT SELECTOR
        ================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background:
              '#0f172a',
            border:
              '1px solid rgba(255,255,255,0.08)',
            display:
              'flex',
            gap: 2
          }}
        >

          <TextField
            select
            fullWidth
            label="Select Patient from Records"
            value={
              selectedContactId
            }
            onChange={
              handleSelectPatient
            }

            variant="outlined"

            sx={{

              '& .MuiOutlinedInput-root':
                {
                  backgroundColor:
                    'rgba(0,0,0,0.3)',

                  color:
                    '#fff'
                },

              '& .MuiInputLabel-root':
                {
                  color:
                    '#94a3b8'
                },

              '& .MuiSelect-select':
                {
                  color:
                    '#fff'
                },

              '& .MuiSvgIcon-root':
                {
                  color:
                    '#fff'
                }

            }}
          >

            <MenuItem value="">
              <em>
                -- Select a patient --
              </em>
            </MenuItem>


            {contactsList.map(
              (contact) => (

                <MenuItem
                  key={
                    contact.id
                  }
                  value={
                    contact.id
                  }
                >

                  {contact.fullName}

                </MenuItem>

              )
            )}

          </TextField>


          <Tooltip
            title="Pricing Settings"
          >

            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                setIsPriceSettingsOpen(
                  true
                )
              }

              sx={{
                minWidth:
                  '60px',

                borderRadius:
                  2
              }}
            >

              <IconSettings />

            </Button>

          </Tooltip>

        </Paper>


        {/* =================================================
            PATIENT HEADER
        ================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 5,
            background:
              '#0f172a',
            border:
              '1px solid rgba(255,255,255,0.08)',
            display:
              'flex',
            justifyContent:
              'space-between',
            flexWrap:
              'wrap',
            gap: 3
          }}
        >

          <Box
            sx={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 3
            }}
          >

            <Avatar
              sx={{
                background:
                  'linear-gradient(135deg, #0ea5e9, #3b82f6)',

                width:
                  70,

                height:
                  70,

                fontSize:
                  '1.8rem',

                fontWeight:
                  'bold'
              }}
            >

              {
                patientDisplayName
                  .charAt(0)
                  .toUpperCase()
              }

            </Avatar>


            <Box>

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#0ea5e9',

                  fontWeight:
                    '800',

                  textTransform:
                    'uppercase'
                }}
              >

                Linkdent CRM

              </Typography>


              <Typography
                variant="h4"
                sx={{
                  fontWeight:
                    '900',

                  color:
                    '#ffffff'
                }}
              >

                {
                  patientDisplayName
                }

              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color:
                    isOdontogramLoading
                      ? '#f59e0b'
                      : isOdontogramLoaded
                        ? '#10b981'
                        : '#94a3b8',
                  fontWeight: 600
                }}
              >
                {odontogramStatusText}
              </Typography>

            </Box>

          </Box>


          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            gap={1}
          >

            <Button
              variant="outlined"
              onClick={
                handleNewSession
              }

              sx={{
                fontWeight:
                  'bold',

                borderRadius:
                  3,

                px: 3,

                py: 1.5,

                borderColor:
                  'rgba(255,255,255,0.2)',

                color:
                  '#fff',

                '&:hover':
                  {
                    bgcolor:
                      'rgba(255,255,255,0.05)'
                  }
              }}

              startIcon={
                <IconHistory />
              }
            >

              Start New Session

            </Button>


            <Button
              variant="contained"
              onClick={
                handleGenerateDevis
              }

              sx={{
                fontWeight:
                  'bold',

                borderRadius:
                  3,

                px: 3,

                py: 1.5,

                background:
                  'linear-gradient(135deg, #8b5cf6, #6d28d9)'
              }}

              startIcon={
                <IconReceipt />
              }
            >

              Devis / Checkout

            </Button>

          </Stack>

        </Paper>


        {/* =================================================
            DIAGNOSTIC TOOLS
        ================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 5,
            background:
              '#0f172a',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >

          <Typography
            variant="subtitle2"
            sx={{
              mb: 3,
              fontWeight:
                '800',

              color:
                '#94a3b8',

              textTransform:
                'uppercase'
            }}
          >

            Diagnostic Tools & Treatments

          </Typography>


          <Stack
            direction="row"
            gap={2}
            flexWrap="wrap"
            justifyContent="center"
          >

            {Object.values(
              DYNAMIC_TRAITEMENTS
            ).map(
              (tool) => (

                <Button
                  key={
                    tool.id
                  }

                  variant={
                    activeTool ===
                    tool.id
                      ? 'contained'
                      : 'outlined'
                  }

                  onClick={() =>
                    setActiveTool(
                      tool.id
                    )
                  }

                  sx={{

                    bgcolor:
                      activeTool ===
                      tool.id
                        ? tool.color
                        : 'rgba(255,255,255,0.03)',

                    color:
                      activeTool ===
                      tool.id
                        ? '#fff'
                        : '#cbd5e1',

                    borderColor:
                      activeTool ===
                      tool.id
                        ? 'transparent'
                        : 'rgba(255,255,255,0.1)',

                    fontWeight:
                      '700',

                    borderRadius:
                      3,

                    px: 3,

                    py: 1.2,

                    textTransform:
                      'none',

                    borderStyle:
                      tool.id ===
                      'eraser'
                        ? 'dashed'
                        : 'solid'
                  }}
                >

                  {
                    tool.label
                  }

                  {
                    tool.price >
                    0
                      ? ` (${tool.price} MAD)`
                      : ''
                  }

                </Button>

              )
            )}

          </Stack>

        </Paper>


        {/* =================================================
            DENTAL MAP
        ================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 5,
            mb: 4,
            background:
              '#0f172a',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >

          {/* UPPER MAXILLARY */}

          <Box>

            <Typography
              variant="subtitle2"
              align="center"
              sx={{
                mb: 3,
                color:
                  '#94a3b8',
                fontWeight:
                  '800'
              }}
            >

              UPPER MAXILLARY

            </Typography>


            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              flexWrap="wrap"
            >

              <Stack
                direction="row"
                spacing={0.5}
              >

                {QUADRANT_1.map(
                  (num) => (

                    <DentAnatomique
                      key={num}
                      number={num}
                      isUpper={true}
                      toothData={
                        teethState[
                          num
                        ]
                      }
                      onSurfaceClick={
                        handleSurfaceClick
                      }
                      dynamicTraitements={
                        DYNAMIC_TRAITEMENTS
                      }
                    />

                  )
                )}

              </Stack>


              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderRightWidth:
                    3,

                  borderColor:
                    'rgba(255,255,255,0.1)'
                }}
              />


              <Stack
                direction="row"
                spacing={0.5}
              >

                {QUADRANT_2.map(
                  (num) => (

                    <DentAnatomique
                      key={num}
                      number={num}
                      isUpper={true}
                      toothData={
                        teethState[
                          num
                        ]
                      }
                      onSurfaceClick={
                        handleSurfaceClick
                      }
                      dynamicTraitements={
                        DYNAMIC_TRAITEMENTS
                      }
                    />

                  )
                )}

              </Stack>

            </Stack>

          </Box>


          <Divider
            sx={{
              borderColor:
                'rgba(255,255,255,0.1)',

              borderBottomWidth:
                3,

              my: 4
            }}
          />


          {/* LOWER MANDIBLE */}

          <Box>

            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              flexWrap="wrap"
            >

              <Stack
                direction="row"
                spacing={0.5}
              >

                {QUADRANT_4.map(
                  (num) => (

                    <DentAnatomique
                      key={num}
                      number={num}
                      isUpper={false}
                      toothData={
                        teethState[
                          num
                        ]
                      }
                      onSurfaceClick={
                        handleSurfaceClick
                      }
                      dynamicTraitements={
                        DYNAMIC_TRAITEMENTS
                      }
                    />

                  )
                )}

              </Stack>


              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderRightWidth:
                    3,

                  borderColor:
                    'rgba(255,255,255,0.1)'
                }}
              />


              <Stack
                direction="row"
                spacing={0.5}
              >

                {QUADRANT_3.map(
                  (num) => (

                    <DentAnatomique
                      key={num}
                      number={num}
                      isUpper={false}
                      toothData={
                        teethState[
                          num
                        ]
                      }
                      onSurfaceClick={
                        handleSurfaceClick
                      }
                      dynamicTraitements={
                        DYNAMIC_TRAITEMENTS
                      }
                    />

                  )
                )}

              </Stack>

            </Stack>


            <Typography
              variant="subtitle2"
              align="center"
              sx={{
                mt: 3,
                color:
                  '#94a3b8',
                fontWeight:
                  '800'
              }}
            >

              LOWER MANDIBLE

            </Typography>

          </Box>

        </Paper>

      </Box>


      {/* =====================================================
          PRICE SETTINGS DIALOG
      ====================================================== */}

      <Dialog
        open={
          isPriceSettingsOpen
        }

        onClose={() =>
          setIsPriceSettingsOpen(
            false
          )
        }

        maxWidth="sm"
        fullWidth

        PaperProps={{
          sx: {
            borderRadius:
              4,

            bgcolor:
              '#0f172a',

            color:
              '#fff',

            border:
              '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >

        <Box
          sx={{
            p: 4,
            textAlign:
              'center'
          }}
        >

          <Typography
            variant="h4"
            sx={{
              color:
                '#fff',

              fontWeight:
                '900',

              mb: 1
            }}
          >

            Clinic Price List

          </Typography>


          <Typography
            variant="body2"
            sx={{
              color:
                '#94a3b8'
            }}
          >

            Set default pricing

          </Typography>

        </Box>


        <DialogContent
          sx={{
            p: 3
          }}
        >

          <Stack spacing={2}>

            {[
              {
                id:
                  'filling',
                label:
                  'Filling'
              },

              {
                id:
                  'endo',
                label:
                  'Root Canal (Endo)'
              },

              {
                id:
                  'extracted',
                label:
                  'Extraction'
              },

              {
                id:
                  'crown',
                label:
                  'Crown'
              },

              {
                id:
                  'implant',
                label:
                  'Implant'
              }

            ].map(
              (item) => (

                <Paper
                  key={
                    item.id
                  }

                  elevation={0}

                  sx={{
                    p: 2,

                    display:
                      'flex',

                    justifyContent:
                      'space-between',

                    alignItems:
                      'center',

                    borderRadius:
                      3,

                    bgcolor:
                      'rgba(255,255,255,0.02)',

                    border:
                      '1px solid rgba(255,255,255,0.05)'
                  }}
                >

                  <Typography
                    sx={{
                      fontWeight:
                        'bold',

                      color:
                        '#fff'
                    }}
                  >

                    {
                      item.label
                    }

                  </Typography>


                  <TextField
                    type="number"
                    variant="outlined"

                    value={
                      customPrices[
                        item.id
                      ]
                    }

                    onChange={(
                      e
                    ) =>
                      setCustomPrices(
                        {
                          ...customPrices,

                          [item.id]:
                            Number(
                              e.target.value
                            )
                        }
                      )
                    }

                    sx={{
                      width:
                        '140px',

                      '& .MuiOutlinedInput-root':
                        {
                          bgcolor:
                            'rgba(0,0,0,0.3)',

                          color:
                            '#fff'
                        }
                    }}
                  />

                </Paper>

              )
            )}

          </Stack>

        </DialogContent>


        <DialogActions
          sx={{
            p: 3,
            justifyContent:
              'space-between'
          }}
        >

          <Button
            onClick={() =>
              setIsPriceSettingsOpen(
                false
              )
            }

            sx={{
              color:
                '#94a3b8'
            }}
          >

            Cancel

          </Button>


          <Button
            onClick={
              handleSavePrices
            }

            variant="contained"

            sx={{
              bgcolor:
                '#10b981'
            }}
          >

            Save Pricing

          </Button>

        </DialogActions>

      </Dialog>


      {/* =====================================================
          DEVIS / CHECKOUT DIALOG
      ====================================================== */}

      <Dialog
        open={
          isDevisOpen
        }

        onClose={() =>
          setIsDevisOpen(
            false
          )
        }

        maxWidth="md"
        fullWidth

        PaperProps={{
          sx: {
            bgcolor:
              '#0f172a',

            color:
              '#fff'
          }
        }}
      >

        <Box
          sx={{
            display:
              'flex',

            flexDirection: {
              xs:
                'column',

              md:
                'row'
            }
          }}
        >

          {/* ================================================
              INVOICE DETAILS
          ================================================= */}

          <Box
            sx={{
              width: {
                xs:
                  '100%',

                md:
                  '50%'
              },

              p: 4,

              backgroundColor:
                '#0f172a',

              borderRight:
                '1px solid rgba(255,255,255,0.05)'
            }}
          >

            <Typography
              variant="h5"
              sx={{
                fontWeight:
                  'bold',

                mb: 3,

                color:
                  '#a855f7'
              }}
            >

              Treatment Details & Invoice

            </Typography>


            <Table
              size="small"
              sx={{
                mb: 4
              }}
            >

              <TableHead
                sx={{
                  backgroundColor:
                    'rgba(155,116,116,0.03)'
                }}
              >

                <TableRow>

                  <TableCell
                    sx={{
                      color:
                        '#cbd5e1'
                    }}
                  >

                    Tooth

                  </TableCell>


                  <TableCell
                    sx={{
                      color:
                        '#cbd5e1'
                    }}
                  >

                    Procedure

                  </TableCell>


                  <TableCell
                    align="left"
                    sx={{
                      color:
                        '#cbd5e1'
                    }}
                  >

                    Price

                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {devisItems.map(
                  (
                    item,
                    index
                  ) => (

                    <TableRow
                      key={
                        index
                      }
                    >

                      <TableCell
                        sx={{
                          color:
                            '#fff'
                        }}
                      >

                        {
                          item.tooth
                        }

                      </TableCell>


                      <TableCell
                        sx={{
                          color:
                            '#fff'
                        }}
                      >

                        {
                          item.acte
                        }

                      </TableCell>


                      <TableCell
                        align="left"
                        sx={{
                          color:
                            '#10b981',

                          fontWeight:
                            'bold'
                        }}
                      >

                        {
                          item.price
                        }{' '}
                        MAD

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>


            <Box
              sx={{
                display:
                  'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',

                p: 2,

                backgroundColor:
                  'rgba(0,0,0,0.3)',

                borderRadius:
                  2
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  fontWeight:
                    800,

                  color:
                    '#fff'
                }}
              >

                Expected Total:

              </Typography>


              <Typography
                variant="h5"
                sx={{
                  fontWeight:
                    900,

                  color:
                    '#10b981'
                }}
              >

                {
                  devisTotal
                }{' '}
                MAD

              </Typography>

            </Box>

          </Box>


          {/* ================================================
              PAYMENT
          ================================================= */}

          <Box
            sx={{
              width: {
                xs:
                  '100%',

                md:
                  '50%'
              },

              p: 4,

              backgroundColor:
                '#0f172a'
            }}
          >

            <Typography
              variant="h5"
              sx={{
                fontWeight:
                  'bold',

                mb: 3,

                color:
                  '#fff'
              }}
            >

              💳 Save Invoice

            </Typography>


            <RadioGroup
              row
              value={
                paymentMode
              }

              onChange={(
                e
              ) =>
                setPaymentMode(
                  e.target.value
                )
              }

              sx={{
                mb: 4
              }}
            >

              <FormControlLabel
                value="full"

                control={
                  <Radio
                    sx={{
                      color:
                        '#10b981'
                    }}
                  />
                }

                label={
                  <Typography
                    sx={{
                      color:
                        '#fff'
                    }}
                  >

                    Full Payment

                  </Typography>
                }
              />


              <FormControlLabel
                value="split"

                control={
                  <Radio
                    sx={{
                      color:
                        '#a855f7'
                    }}
                  />
                }

                label={
                  <Typography
                    sx={{
                      color:
                        '#fff'
                    }}
                  >

                    Installment Plan

                  </Typography>
                }
              />

            </RadioGroup>


            {paymentMode ===
              'split' && (

              <Box>

                <TextField
                  fullWidth

                  label="Advance Payment"

                  type="number"

                  value={
                    advancePayment
                  }

                  onChange={(
                    e
                  ) =>
                    setAdvancePayment(
                      Number(
                        e.target.value
                      )
                    )
                  }

                  sx={{
                    mb: 3,

                    '& .MuiOutlinedInput-root':
                      {
                        bgcolor:
                          'rgba(0,0,0,0.3)',

                        color:
                          '#fff'
                      },

                    '& .MuiInputLabel-root':
                      {
                        color:
                          '#94a3b8'
                      }
                  }}
                />


                <TextField
                  fullWidth

                  label="Number of Months"

                  type="number"

                  value={
                    installmentsCount
                  }

                  onChange={(
                    e
                  ) =>
                    setInstallmentsCount(
                      Number(
                        e.target.value
                      )
                    )
                  }

                  sx={{
                    mb: 3,

                    '& .MuiOutlinedInput-root':
                      {
                        bgcolor:
                          'rgba(0,0,0,0.3)',

                        color:
                          '#fff'
                      },

                    '& .MuiInputLabel-root':
                      {
                        color:
                          '#94a3b8'
                      }
                  }}
                />

              </Box>

            )}


            <Button
              fullWidth

              onClick={
                handleProcessPayment
              }

              variant="contained"

              disabled={
                isSaving
              }

              sx={{
                py: 1.5,

                bgcolor:
                  '#10b981',

                fontWeight:
                  'bold'
              }}
            >

              {
                isSaving
                  ? 'Saving...'
                  : 'Save Invoice to Patient File'
              }

            </Button>

          </Box>

        </Box>

      </Dialog>

      </Box>
    </>

  );
};


export default OdontogrammePro;